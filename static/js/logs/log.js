// const Thing = require('../thing');
const App = require('../app');
const Utils = require('../utils');

class Log {
  constructor(thingId, propertyId) {
    this.thingId = thingId;
    this.propertyId = propertyId;
    this.start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.end = new Date(Date.now());

    this.margin = 20;
    this.xStart = 120 + 2 * this.margin;
    this.width = window.innerWidth - 2 * this.margin;
    this.height = 120;
    this.graphHeight = this.height - 2 * this.margin;
    this.graphWidth = this.width - this.xStart - this.margin;
    this.elt = document.createElement('div');
    this.elt.classList.add('logs-log-container');
    this.rawPoints = [];

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.drawSkeleton();
  }

  drawSkeleton() {
    // Get in the name and webcomponent
    this.name = document.createElement('h3');
    this.name.classList.add('logs-log-name');
    const thingContainer = document.createElement('div');
    // new Thing(thingContainer); // TODO

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('logs-log-info');
    infoContainer.appendChild(this.name);
    infoContainer.appendChild(thingContainer);
    this.elt.appendChild(infoContainer);

    this.graph = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.graph.classList.add('logs-graph');
    this.graph.style.width = `${this.width}px`;
    this.graph.style.height = `${this.height}px`;
    this.graph.addEventListener('mousemove', this.onPointerMove);
    this.graph.addEventListener('mouseleave', this.onPointerUp);

    const axesPath = this.makePath([
      {x: this.xStart, y: this.margin},
      {x: this.xStart, y: this.height - this.margin},
      {x: this.width - this.margin, y: this.height - this.margin},
    ]);
    axesPath.classList.add('logs-graph-axes');
    this.graph.appendChild(axesPath);

    this.yAxisLabel = this.makeText('', this.xStart - this.margin / 4,
                                    this.height / 2, 'end', 'middle');
    this.yAxisLabel.classList.add('logs-graph-label');
    this.graph.appendChild(this.yAxisLabel);

    this.progress = document.createElementNS('http://www.w3.org/2000/svg',
                                             'rect');
    this.progress.classList.add('logs-graph-progress');
    this.progress.setAttribute('x', this.xStart);
    this.progress.setAttribute('y', this.margin);
    this.progressWidth = Math.floor(0.05 * this.graphWidth);
    this.progress.setAttribute('width', this.progressWidth);
    this.progress.setAttribute('height', this.graphHeight);

    this.graph.appendChild(this.progress);

    this.elt.appendChild(this.graph);

    this.tooltip = document.createElement('div');
    this.tooltip.classList.add('logs-graph-tooltip');
    this.tooltipValue = document.createElement('p');
    this.tooltipDate = document.createElement('p');
    this.tooltip.appendChild(this.tooltipValue);
    this.tooltip.appendChild(this.tooltipDate);
    this.elt.appendChild(this.tooltip);
  }

  makePath(points) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const text = ['M', points[0].x, points[0].y];
    for (let i = 1; i < points.length; i++) {
      text.push('L', points[i].x, points[i].y);
    }
    path.setAttribute('d', text.join(' '));
    return path;
  }

  makeText(text, x, y, anchor, baseline) {
    const elt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    elt.textContent = text;
    elt.setAttribute('text-anchor', anchor);
    elt.setAttribute('dominant-baseline', baseline);
    elt.setAttribute('x', x);
    elt.setAttribute('y', y);
    return elt;
  }

  async load() {
    const thing = await App.gatewayModel.getThingModel(this.thingId);
    if (!thing) {
      // be sad
      return;
    }
    const thingName = thing.name;
    this.property = thing.propertyDescriptions[this.propertyId];
    const propertyName = this.property.title;
    this.name.textContent = `${thingName} ${propertyName}`;

    const propertyUnit = this.property.unit || '';
    this.yAxisLabel.textContent = Utils.unitNameToAbbreviation(propertyUnit);

    // const data = await this.fetchRawPoints();
    // if (!data || !data.length) {
    //   this.rawPoints = [];
    //   return;
    // }
    // this.rawPoints = [];
    // for (let i = 0; i < data.length; i++) {
    //   const point = data[i];
    //   if (point.date < this.start.getTime() ||
    //       point.date > this.end.getTime()) {
    //     continue;
    //   }
    //   this.rawPoints.push({
    //     value: point.value,
    //     time: point.date,
    //   });
    // }
  }

  addRawPoint(point) {
    if (point.date < this.start.getTime() ||
        point.date > this.end.getTime()) {
      return;
    }
    this.rawPoints.push({
      value: point.value,
      time: point.date,
    });
    if (this.rawPoints.length > 2) {
      const fractionDone = (point.date - this.start.getTime()) /
        (this.end.getTime() - this.start.getTime());
      const width = Math.floor(fractionDone * this.graphWidth);
      if (width > this.progressWidth) {
        this.progress.setAttribute('width', width);
        this.progressWidth = width;
      }
    }
    // update progress bar
  }

  /*
  fetchRawPoints() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const start = Date.now();
      const onProgress = (event) => {
        if (event.lengthComputable) {
          const width = event.loaded / event.total * this.graphWidth;
          this.progress.setAttribute('width', width);
        } else {
          // Oscillate between 0 width and max width starting at 0
          const width = (1 - Math.cos((Date.now() - start) / 3000)) / 2 *
            this.graphWidth;
          this.progress.setAttribute('width', width);
        }
      };
      const onLoad = () => {
        xhr.removeEventListener('progress', onProgress);
        xhr.removeEventListener('load', onLoad);
        this.progress.setAttribute('width', 0);
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          reject(e);
        }
      };
      xhr.addEventListener('progress', onProgress);
      xhr.addEventListener('load', onLoad);
      let url = `/logs/things/${this.thingId}/properties/${this.propertyId}`;
      url += `?start=${this.start.getTime()}&end=${this.end.getTime()}`;
      xhr.open('GET', url);
      const headers = API.headers();
      for (const name in headers) {
        xhr.setRequestHeader(name, headers[name]);
      }
      xhr.send(null);
    });
  }
  */

  valueBounds() {
    if (this.property.unit === 'percent') {
      return {
        min: 0,
        max: 100,
      };
    }
    if (this.property.hasOwnProperty('minimum') &&
        this.property.hasOwnProperty('maximum')) {
      return {
        min: this.property.minimum,
        max: this.property.maximum,
      };
    }
    if (this.property.type === 'boolean') {
      return {
        min: 0,
        max: 1,
      };
    }

    if (this.rawPoints.length === 0) {
      return {min: 0, max: 1};
    }
    let min = this.rawPoints[0].value;
    let max = min;
    for (let i = 1; i < this.rawPoints.length; i++) {
      const value = this.rawPoints[i].value;
      if (max < value) {
        max = value;
      }
      if (min > value) {
        min = value;
      }
    }
    let margin = 0.1 * (max - min);
    if (this.rawPoints.length === 1 || min === max) {
      margin = 1;
    }
    return {
      min: min - margin,
      max: max + margin,
    };
  }

  timeToX(time) {
    const startTime = this.start.getTime();
    const endTime = this.end.getTime();
    return (time - startTime) / (endTime - startTime) * this.graphWidth +
      this.xStart;
  }

  xToTime(x) {
    const startTime = this.start.getTime();
    const endTime = this.end.getTime();
    return (x - this.xStart) / this.graphWidth * (endTime - startTime) +
      startTime;
  }

  valueToY(value) {
    // TODO consolidate with yScale
    const bounds = this.valueBounds();
    let valueMin = Math.min(0, bounds.min);
    let valueMax = bounds.max;
    const lowestPowerOf10ToPreserve =
      Math.pow(10, Math.ceil(Math.log(valueMax - valueMin) / Math.LN10) - 3);
    valueMax = Math.ceil(valueMax / lowestPowerOf10ToPreserve) *
      lowestPowerOf10ToPreserve;
    valueMin = Math.floor(valueMin / lowestPowerOf10ToPreserve) *
      lowestPowerOf10ToPreserve;

    return this.height - this.margin -
      (value - valueMin) / (valueMax - valueMin) * this.graphHeight;
  }

  redraw() {
    if (!this.property) {
      return;
    }

    this.progress.setAttribute('width', 0);
    this.progressWidth = 0;

    const bounds = this.valueBounds();
    let yMin = Math.min(0, bounds.min);
    let yMax = bounds.max;
    console.log(this.property, yMin, yMax);
    // Preserve 3 significant figures (not using toPrecision since that does
    // scientific notation)
    const lowestPowerOf10ToPreserve =
      Math.pow(10, Math.ceil(Math.log(yMax - yMin) / Math.LN10) - 3);
    yMax = Math.ceil(yMax / lowestPowerOf10ToPreserve) *
      lowestPowerOf10ToPreserve;
    yMin = Math.floor(yMin / lowestPowerOf10ToPreserve) *
      lowestPowerOf10ToPreserve;
    console.log('now', yMin, yMax);

    const yScale = (y) => {
      return this.height - this.margin - (y - yMin) / (yMax - yMin) *
        this.graphHeight;
    };

    const points = [];
    console.log('waaaaa', this.property);
    for (let i = 0; i < this.rawPoints.length; i++) {
      const raw = this.rawPoints[i];
      const x = this.timeToX(raw.time);
      const y = yScale(raw.value);
      // Add a point so that the value steps down instead of gradually
      // decreasing
      if (i > 0 && (this.property.type === 'boolean' ||
          this.property.type === 'integer')) {
        points.push({
          x,
          y: points[i - 1].y,
        });
      }
      points.push({x, y});
    }

    if (points.length > 0) {
      // Make sure the data extends to the present
      points.push({
        x: this.graphWidth + this.xStart,
        y: points[points.length - 1].y,
      });

      const graphLine = this.makePath(points);
      graphLine.classList.add('logs-graph-line');

      points.unshift({
        x: points[0].x,
        y: this.height - this.margin,
      });
      points.push({
        x: points[points.length - 1].x,
        y: this.height - this.margin,
      });

      const graphFill = this.makePath(points);
      graphFill.classList.add('logs-graph-fill');

      this.graph.appendChild(graphFill);
      this.graph.appendChild(graphLine);
    }

    const places = Math.max(0, 2 - Math.log(yMax - yMin) / Math.LN10);
    let labelText = yMin.toFixed(places);
    if (this.property.type === 'boolean') {
      labelText = this.propertyLabel(false);
    } else if (Math.floor(yMin) === yMin) {
      labelText = yMin.toFixed(0);
    }
    let label = this.makeText(labelText, this.xStart - this.margin / 4,
                              yScale(yMin), 'end', 'middle');
    label.classList.add('logs-graph-label');
    this.graph.appendChild(label);

    labelText = yMax.toFixed(places);
    if (this.property.type === 'boolean') {
      labelText = this.propertyLabel(true);
    } else if (Math.floor(yMax) === yMax) {
      labelText = yMax.toFixed(0);
    }
    label = this.makeText(labelText, this.xStart - this.margin / 4,
                          yScale(yMax), 'end', 'middle');
    label.classList.add('logs-graph-label');
    this.graph.appendChild(label);

    let xLabel = this.floorDate(new Date(this.start.getTime())).getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (xLabel < this.start.getTime()) {
      xLabel += oneDayMs;
    }
    while (xLabel < this.end.getTime()) {
      const text = new Date(xLabel).getDate();
      label = this.makeText(text, this.timeToX(xLabel),
                            this.height - this.margin, 'middle', 'hanging');
      label.classList.add('logs-graph-label');
      this.graph.appendChild(label);

      xLabel += oneDayMs;
    }
  }

  /**
   * Return a label for a property's value
   */
  propertyLabel(value) {
    if (this.property.type === 'boolean') {
      switch (this.property['@type']) {
        case 'OnOffProperty':
          return value ? 'ON' : 'OFF';
        case 'MotionProperty':
          return value ? 'MOTION' : 'NO MOTION';
        case 'OpenProperty':
          return value ? 'OPEN' : 'CLOSED';
        case 'LeakProperty':
          return value ? 'LEAK' : 'DRY';
        case 'PushedProperty':
          return value ? 'PUSHED' : 'NOT PUSHED';
        case 'BooleanProperty':
        default:
          return value ? 'TRUE' : 'FALSE';
      }
    }
    return `${value}`;
  }

  /**
   * Convert a date to the start of its day, i.e. zero out hours, minutes, and
   * seconds.
   * TODO: support timezones
   */
  floorDate(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  }

  nearestPoint(time) {
    let start = 0;
    let end = this.rawPoints.length - 1;
    let mid = 0;
    while (end > start) {
      mid = Math.floor((start + end) / 2);
      if (this.rawPoints[mid].time < time) {
        start = mid + 1;
      } else if (this.rawPoints[mid].time > time) {
        end = mid - 1;
      } else {
        break;
      }
    }

    let nearestPoint = this.rawPoints[mid];
    const diff = time - nearestPoint.time;

    if (diff > 0 && mid < this.rawPoints.length - 1) {
      const otherDiff = time - this.rawPoints[mid + 1].time;
      if (Math.abs(diff) > Math.abs(otherDiff)) {
        nearestPoint = this.rawPoints[mid + 1];
      }
    }
    if (diff < 0 && mid > 0) {
      const otherDiff = time - this.rawPoints[mid - 1].time;
      if (Math.abs(diff) > Math.abs(otherDiff)) {
        nearestPoint = this.rawPoints[mid - 1];
      }
    }

    const closenessBuffer = this.xToTime(48) - this.xToTime(0);
    console.log('maybe', nearestPoint, time, closenessBuffer,
                Math.abs(time - nearestPoint.time));
    if (Math.abs(time - nearestPoint.time) < closenessBuffer) {
      return nearestPoint;
    }
    return null;
  }

  onPointerMove(event) {
    if (!this.rawPoints || this.rawPoints.length === 0) {
      return;
    }
    const time = this.xToTime(event.clientX);
    if (time < this.start.getTime() || time > this.end.getTime()) {
      this.removeTooltip();
      return;
    }

    const point = this.nearestPoint(time);
    if (!point) {
      this.removeTooltip();
      return;
    }
    const x = this.timeToX(point.time);
    const y = this.valueToY(point.value);
    this.tooltip.style.display = 'block';
    this.tooltip.style.transform = `translate(${x}px,${y}px)`;

    const unit = Utils.unitNameToAbbreviation(this.property.unit || '');
    this.tooltipValue.textContent = `${point.value} ${unit}`;

    // const dateParts = new Date(point.time).toDateString().split(' ');
    // this.tooltipDate.textContent = `${dateParts[1]} ${dateParts[2]}`;
    const dateParts = new Date(point.time).toTimeString().split(' ');
    this.tooltipDate.textContent = `${dateParts[0]}`;

    if (!this.pointHighlight) {
      this.pointHighlight =
        document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      this.pointHighlight.classList.add('logs-graph-point-highlight');
      this.pointHighlight.setAttribute('r', 3);
      this.graph.appendChild(this.pointHighlight);
    }
    this.pointHighlight.setAttribute('cx', x);
    this.pointHighlight.setAttribute('cy', y);
  }

  onPointerUp() {
    this.removeTooltip();
  }


  removeTooltip() {
    this.tooltip.style.display = 'none';
    if (this.pointHighlight) {
      this.pointHighlight.parentNode.removeChild(this.pointHighlight);
      this.pointHighlight = null;
    }
  }
}

module.exports = Log;
