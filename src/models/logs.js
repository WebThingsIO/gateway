const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const AddonManager = require('../addon-manager');
const Constants = require('../constants');
const UserProfile = require('../user-profile');

const METRICS_NUMBER = 'metricsNumber';
const METRICS_BOOLEAN = 'metricsBoolean';
const METRICS_OTHER = 'metricsOther';

class Logs {
  constructor() {
    this.db = null;
    this.data = {};
    this.idToDescr = {};
    this.descrToId = {};
    this.onPropertyChanged = this.onPropertyChanged.bind(this);

    AddonManager.on(Constants.PROPERTY_CHANGED, this.onPropertyChanged);
  }

  clear() {
    return Promise.all([
      METRICS_NUMBER,
      METRICS_BOOLEAN,
      METRICS_OTHER,
      'metricIds',
    ].map((table) => {
      return this.run(`DELETE FROM ${table}`);
    }));
  }

  open() {
    // Get all things, create table if not exists
    // If the database is already open, just return.
    if (this.db) {
      return;
    }

    let filename;
    let exists = false;
    if (process.env.NODE_ENV === 'test') {
      filename = ':memory:';
    } else {
      filename = path.join(UserProfile.logDir, 'logs.sqlite3');

      // Check if database already exists
      exists = fs.existsSync(filename);
    }

    console.log(exists ? 'Opening' : 'Creating', 'database:', filename);
    // Open database or create it if it doesn't exist
    this.db = new sqlite3.Database(filename);

    // Set a timeout in case the database is locked. 10 seconds is a bit long,
    // but it's better than crashing.
    this.db.configure('busyTimeout', 10000);

    this.db.serialize(() => {
      this.createTables();
      this.loadKnownMetrics();
    });
  }

  createTables() {
    return Promise.all([
      this.createMetricTable(METRICS_NUMBER, typeof 0),
      this.createMetricTable(METRICS_BOOLEAN, typeof false),
      this.createMetricTable(METRICS_OTHER, typeof {}),
      this.createIdTable(),
    ]);
  }

  createIdTable() {
    // We use a version of sqlite which doesn't support foreign keys so id is
    // an integer referenced by the metric tables
    return this.run(`CREATE TABLE IF NOT EXISTS metricIds (
      id INTEGER PRIMARY KEY ASC,
      descr TEXT
    );`, []);
  }

  createMetricTable(id, type) {
    const table = id;
    let sqlType = 'TEXT';

    switch (type) {
      case 'number':
        sqlType = 'REAL';
        break;
      case 'boolean':
        sqlType = 'INTEGER';
        break;
    }

    return this.run(`CREATE TABLE IF NOT EXISTS ${table} (
      id INTEGER,
      date DATE,
      value ${sqlType}
    );`, []);
  }

  async loadKnownMetrics() {
    const rows = await this.all('SELECT id, descr FROM metricIds');
    for (const row of rows) {
      this.idToDescr[row.id] = row.descr;
      this.descrToId[row.descr] = row.id;
    }
  }

  propertyDescr(thingId, propId) {
    return JSON.stringify({
      type: 'property',
      thing: thingId,
      property: propId,
    });
  }

  actionDescr(thingId, actionId) {
    return JSON.stringify({
      type: 'action',
      thing: thingId,
      action: actionId,
    });
  }

  eventDescr(thingId, eventId) {
    return JSON.stringify({
      type: 'event',
      thing: thingId,
      event: eventId,
    });
  }

  async registerMetric(descr) {
    const result = await this.run(
      'INSERT INTO metricIds (descr) VALUES (?)',
      [descr]
    );
    const id = result.lastID;
    this.idToDescr[id] = descr;
    this.descrToId[descr] = id;
    return id;
  }

  async insertMetric(descr, rawValue, date) {
    let table = METRICS_OTHER;
    let value = rawValue;

    switch (typeof rawValue) {
      case 'boolean':
        table = METRICS_BOOLEAN;
        break;
      case 'number':
        table = METRICS_NUMBER;
        break;
      default:
        value = JSON.stringify(rawValue);
        break;
    }

    let id = -1;
    if (this.descrToId.hasOwnProperty(descr)) {
      id = this.descrToId[descr];
    } else {
      id = await this.registerMetric(descr);
    }

    await this.run(
      `INSERT INTO ${table} (id, date, value) VALUES (?, ?, ?)`,
      [id, date, value]
    );
  }

  onPropertyChanged(property) {
    const thingId = property.device.id;
    const descr = this.propertyDescr(thingId, property.name);
    this.insertMetric(descr, property.value, new Date());
  }

  onEvent() {
  }

  onAction() {
  }

  async loadMetrics(out, table, transformer) {
    const rows = await this.all(`SELECT id, value, date FROM ${table}`);
    console.log('loadMetrics', this.idToDescr, rows);
    for (const row of rows) {
      const descr = JSON.parse(this.idToDescr[row.id]);
      if (!out.hasOwnProperty(descr.thing)) {
        out[descr.thing] = {};
      }
      if (!out[descr.thing].hasOwnProperty(descr.property)) {
        out[descr.thing][descr.property] = [];
      }
      const value = transformer ? transformer(row.value) : row.value;
      out[descr.thing][descr.property].push({
        value: value,
        date: row.date,
      });
    }
  }


  async getAll() {
    const out = {};
    await this.loadMetrics(out, METRICS_NUMBER);
    await this.loadMetrics(out, METRICS_BOOLEAN, (value) => !!value);
    await this.loadMetrics(out, METRICS_OTHER, (value) => JSON.parse(value));
    console.log('getAll', out);
    return out;
  }

  async get(thingId) {
    const all = await this.getAll();
    return all[thingId];
  }

  async getProperty(thingId, propertyName) {
    const all = await this.getAll();
    return all[thingId][propertyName];
  }

  all(sql, ...params) {
    return new Promise((accept, reject) => {
      params.push(function(err, rows) {
        if (err) {
          reject(err);
          return;
        }
        accept(rows);
      });

      try {
        this.db.all(sql, ...params);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Run a SQL statement
   * @param {String} sql
   * @param {Array<any>} values
   * @return {Promise<Object>} promise resolved to `this` of statement result
   */
  run(sql, values) {
    return new Promise((accept, reject) => {
      try {
        this.db.run(sql, values, function(err) {
          if (err) {
            reject(err);
            return;
          }
          // node-sqlite puts results on "this" so avoid arrrow fn.
          accept(this);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = new Logs();

