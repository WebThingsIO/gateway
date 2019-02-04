const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const AddonManager = require('../addon-manager');
const Constants = require('../constants');
const Things = require('./things');
const UserProfile = require('../user-profile');

class Metrics {
  constructor() {
    this.db = null;
    this.data = {};
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
  }

  open() {
    // Get all things, create table if not exists
    // If the database is already open, just return.
    if (this.db) {
      return;
    }

    // Don't pull this from user-profile.js, because that would cause a
    // circular dependency.
    let filename;
    let exists = false;
    if (process.env.NODE_ENV === 'test') {
      filename = ':memory:';
    } else {
      filename = path.join(UserProfile.logDir, 'metrics.sqlite3');

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
    });

    AddonManager.on(Constants.PROPERTY_CHANGED, this.onPropertyChanged);
  }

  createTables() {
    Things.getThings().then((things) => {
      for (const thing of things.entries()) {
        this.registerThing(thing);
      }
    });
  }

  registerThing(thing) {
    for (const name in thing.properties) {
      const property = thing.properties[name];
      this.createTable(this.propertyId(thing.id, name), property.type);
    }

    for (const name in thing.actions) {
      this.createTable(this.actionId(thing.id, name), 'object');
    }

    for (const name in thing.events) {
      this.createTable(this.eventId(thing.id, name), 'object');
    }
  }

  propertyId(thingId, propId) {
    return `thing_${thingId}_property_${propId}`;
  }

  actionId(thingId, actionId) {
    return `thing_${thingId}_action_${actionId}`;
  }

  eventId(thingId, eventId) {
    return `thing_${thingId}_event_${eventId}`;
  }

  createTable() {
  }

  migrate() {
  }

  onPropertyChanged(property) {
    const thingId = property.device.id;
    if (!this.data[thingId]) {
      this.data[thingId] = {};
    }

    const thingData = this.data[thingId];
    if (!thingData[property.name]) {
      thingData[property.name] = [];
    }

    thingData[property.name].push({
      value: property.value,
      date: new Date(),
    });
  }

  onEvent() {
  }

  onAction() {
  }

  async getAll() {
    // const out = {};
    // const rows = await this.all('SELECT id, value, date FROM metricsNumber');

    // for (const row of rows) {
    //   const id = this.foreignKeys[row.id];
    //   if (!out.hasOwnProperty(id)) {
    //     out[id] = [];
    //   }
    //   out[id].push({
    //     value: row.value,
    //     date: row.date,
    //   });
    // }
    // return out;
    return this.data;
  }

  async get(thingId) {
    return this.data[thingId];
  }

  async getProperty(thingId, propertyName) {
    return this.data[thingId][propertyName];
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
}

module.exports = new Metrics();

