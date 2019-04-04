/**
 * Log
 *
 * Draws a single log
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const App = require('../app');
const Icons = require('../icons');
const Utils = require('../utils');

const RIGHT_MOUSE_BUTTON = 2;

class Log {
  constructor(thingId, propertyId, start, end, soloView) {
    this.thingId = thingId;
    this.propertyId = propertyId;
    this.start = start;
    this.end = end;
    this.logStart = start;
    this.logEnd = end;
    this.soloView = soloView;

    this.dimension();
    this.elt = document.createElement('div');
    this.elt.classList.add('logs-log-container');
    if (this.soloView) {
      this.elt.classList.add('logs-log-container-solo-view');
    }
    this.rawPoints = [];

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.mouseDown = false;
    this.dragStart = -1;

    this.drawSkeleton();
  }

  dimension() {
    if (this.soloView) {
      this.xMargin = 96;
      this.yMargin = 30;
      this.xStart = this.xMargin + 20;
      this.width = window.innerWidth;
      this.scrollHeight = 30;
      this.height = window.innerHeight - 96 - this.yMargin * 2 -
        this.scrollHeight;
    } else {
      this.xMargin = 96;
      this.yMargin = 20;
      this.xStart = this.xMargin + 20;
      this.width = window.innerWidth;
      this.height = 200;
      this.scrollHeight = 30;
    }
    this.graphHeight = this.height - 2 * this.yMargin;
    this.graphWidth = this.width - this.xStart - this.xMargin;
  }

  drawSkeleton() {
    this.removeAll('.logs-log-info');
    this.removeAll('.logs-graph');
    this.removeAll('.logs-graph-tooltip');
    this.removeAll('.logs-log-week-dropdown');

    if (!this.soloView) {
      // Get in the name and webcomponent
      if (!this.name) {
        this.name = document.createElement('div');
        this.name.classList.add('logs-log-name');
      }
      if (!this.icon) {
        this.icon = document.createElement('div');
        this.icon.classList.add('logs-log-icon');
      }
      this.infoContainer = document.createElement('a');
      this.infoContainer.classList.add('logs-log-info');
      this.infoContainer.appendChild(this.icon);
      this.infoContainer.appendChild(this.name);
      this.elt.appendChild(this.infoContainer);
    }

    this.createWeekDropdown();

    this.graph = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.graph.classList.add('logs-graph');
    this.graph.style.width = `${this.width}px`;
    this.graph.style.height = `${this.height + this.scrollHeight}px`;
    this.graph.addEventListener('mousedown', this.onPointerDown);
    this.graph.addEventListener('mousemove', this.onPointerMove);
    this.graph.addEventListener('mouseup', this.onPointerUp);
    this.graph.addEventListener('mouseleave', this.onPointerLeave);
    this.graph.addEventListener('contextmenu', (e) => e.preventDefault());

    const axesPath = this.makePath([
      {x: this.xStart, y: this.yMargin},
      {x: this.xStart, y: this.height - this.yMargin},
      {x: this.width - this.xMargin, y: this.height - this.yMargin},
    ]);
    axesPath.classList.add('logs-graph-axes');
    this.graph.appendChild(axesPath);

    this.yAxisLabel = this.makeText('', this.xStart - 5,
                                    this.height / 2, 'end', 'middle');
    this.yAxisLabel.classList.add('logs-graph-label');
    this.graph.appendChild(this.yAxisLabel);

    this.progress = document.createElementNS('http://www.w3.org/2000/svg',
                                             'rect');
    this.progress.classList.add('logs-graph-progress');
    this.progress.setAttribute('x', this.xStart);
    this.progress.setAttribute('y', this.yMargin);
    this.progressWidth = Math.floor(0.05 * this.graphWidth);
    this.progress.setAttribute('width', this.progressWidth);
    this.progress.setAttribute('height', this.graphHeight);

    this.graph.appendChild(this.progress);

    this.selectionHighlight =
      document.createElementNS('http://www.w3.org/2000/svg',
                               'rect');
    this.selectionHighlight.classList.add('logs-graph-selection-highlight');
    this.selectionHighlight.setAttribute('x', this.xStart);
    this.selectionHighlight.setAttribute('y', this.yMargin);
    this.selectionHighlight.setAttribute('width', 0);
    this.selectionHighlight.setAttribute('height', this.graphHeight);

    this.graph.appendChild(this.selectionHighlight);

    this.drawScrollBar();

    this.elt.appendChild(this.graph);

    this.tooltip = document.createElement('div');
    this.tooltip.classList.add('logs-graph-tooltip');
    this.tooltipValue = document.createElement('p');
    this.tooltipDate = document.createElement('p');
    this.tooltip.appendChild(this.tooltipValue);
    this.tooltip.appendChild(this.tooltipDate);
    this.elt.appendChild(this.tooltip);
  }

  createWeekDropdown() {
    this.weekDropdown = document.createElement('select');
    this.weekDropdown.classList.add('logs-log-week-dropdown', 'arrow-select');
    const oneHourMs = 60 * 60 * 1000;
    const oneDayMs = 24 * oneHourMs;
    const oneWeekMs = 7 * oneDayMs;
    const options = [
      {name: 'Hour', value: oneHourMs},
      {name: 'Day', value: oneDayMs},
      {name: 'Week', value: oneWeekMs},
    ];
    for (const opt of options) {
      const option = document.createElement('option');
      option.textContent = opt.name;
      option.value = opt.value;
      if (opt.name === 'Week') {
        option.setAttribute('selected', true);
      }
      this.weekDropdown.appendChild(option);
    }
    this.weekDropdown.addEventListener('change', () => {
      let newEnd = this.end.getTime();
      let newStart = newEnd - this.weekDropdown.value;
      if (newStart < this.logStart.getTime()) {
        newStart = this.logStart.getTime();
        newEnd = newStart + this.weekDropdown.value;
      }
      this.start = new Date(newStart);
      this.end = new Date(newEnd);
      this.redraw();
    });
    this.elt.appendChild(this.weekDropdown);
  }

  makePath(points, close) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const text = ['M', points[0].x, points[0].y];
    for (let i = 1; i < points.length; i++) {
      text.push('L', points[i].x, points[i].y);
    }
    if (close) {
      text.push('Z');
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
    const thing = await App.gatewayModel.getThing(this.thingId);
    const thingModel = await App.gatewayModel.getThingModel(this.thingId);
    if (!thing || !thingModel) {
      // be sad
      return;
    }
    const thingName = thing.name;
    this.property = thingModel.propertyDescriptions[this.propertyId];
    const propertyName = this.property.title;
    const formattedName = `${thingName} ${propertyName}`;
    if (this.soloView) {
      document.querySelector('.logs-header').textContent = formattedName;
    } else {
      this.name.textContent = formattedName;
    }

    if (!this.soloView) {
      let iconUrl = '';
      if (thing.selectedCapability) {
        iconUrl = Icons.capabilityToIcon(thing.selectedCapability);
      } else {
        iconUrl = Icons.typeToIcon(thing.type);
      }
      this.icon.style.backgroundImage = `url(${iconUrl})`;
      const detailUrl = `/logs/things/${this.thingId}/properties/${this.propertyId}`;
      this.infoContainer.setAttribute('href', detailUrl);
    }

    const propertyUnit = this.property.unit || '';
    this.yAxisLabel.textContent = Utils.unitNameToAbbreviation(propertyUnit);

    if (this.rawPoints.length > 0) {
      this.redraw();
    }
  }

  clearPoints() {
    this.rawPoints = [];
  }

  addRawPoint(point) {
    this.rawPoints.push({
      value: point.value,
      time: point.date,
    });

    // update progress bar
    if (this.rawPoints.length > 2) {
      const lastPoint = this.rawPoints[this.rawPoints.length - 1];
      let fractionDone = (lastPoint.time - this.start.getTime()) /
        (this.end.getTime() - this.start.getTime());
      fractionDone = Math.min(fractionDone, 1);
      const width = Math.floor((fractionDone * 0.95 + 0.05) * this.graphWidth);
      if (width > this.progressWidth) {
        this.progress.setAttribute('width', width);
        this.progressWidth = width;
      }
    }
  }

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
    // If there are no values less than zero make the lower bound zero for
    // aesthetic reasons (e.g. power consumption)
    if (min >= 0 && min - margin < 0) {
      min = margin;
    }
    return {
      min: min - margin,
      max: max + margin,
    };
  }

  timeToX(time, customStartTime, customEndTime) {
    const startTime = customStartTime || this.start.getTime();
    const endTime = customEndTime || this.end.getTime();
    return (time - startTime) / (endTime - startTime) * this.graphWidth +
      this.xStart;
  }

  xToTime(x, customStartTime, customEndTime) {
    const startTime = customStartTime || this.start.getTime();
    const endTime = customEndTime || this.end.getTime();
    return (x - this.xStart) / this.graphWidth * (endTime - startTime) +
      startTime;
  }

  valueToY(value) {
    return this.height - this.yMargin -
      (value - this.valueMin) /
      (this.valueMax - this.valueMin) * this.graphHeight;
  }

  determineBounds() {
    const bounds = this.valueBounds();
    this.valueMin = Math.min(0, bounds.min);
    this.valueMax = bounds.max;
    // Preserve 3 significant figures (not using toPrecision since that does
    // scientific notation)
    const lowestPowerOf10ToPreserve = Math.pow(
      10,
      Math.ceil(Math.log(this.valueMax - this.valueMin) / Math.LN10) - 3);
    this.valueMax = Math.ceil(this.valueMax / lowestPowerOf10ToPreserve) *
      lowestPowerOf10ToPreserve;
    this.valueMin = Math.floor(this.valueMin / lowestPowerOf10ToPreserve) *
      lowestPowerOf10ToPreserve;
  }

  redraw() {
    if (!this.property) {
      return;
    }

    this.removeAll('.logs-graph-line');
    this.removeAll('.logs-graph-fill');
    this.removeAll('.logs-graph-label');
    this.removeAll('.logs-graph-tick');

    this.progress.setAttribute('width', 0);
    this.progressWidth = 0;

    this.determineBounds();

    const points = [];
    for (let i = 0; i < this.rawPoints.length; i++) {
      const raw = this.rawPoints[i];
      if (raw.time < this.start.getTime() || raw.time > this.end.getTime()) {
        continue;
      }
      const x = this.timeToX(raw.time);
      const y = this.valueToY(raw.value);

      if (points.length === 0) {
        let value = y;
        if (i > 0) {
          value = this.valueToY(this.rawPoints[i - 1].value);
        }
        // Make sure the data extends to the past
        points.push({
          x: this.xStart,
          y: value,
        });
      }

      // Add a point so that the value steps down instead of gradually
      // decreasing
      if (this.property.type === 'boolean' ||
          this.property.type === 'integer') {
        points.push({
          x,
          y: points[points.length - 1].y,
        });
      }
      points.push({x, y});
    }

    let graphLine, graphFill;

    if (points.length > 0) {
      // Make sure the data extends to the present
      points.push({
        x: this.graphWidth + this.xStart,
        y: points[points.length - 1].y,
      });

      graphLine = this.makePath(points);
      graphLine.classList.add('logs-graph-line');

      points.unshift({
        x: points[0].x,
        y: this.height - this.yMargin,
      });
      points.push({
        x: points[points.length - 1].x,
        y: this.height - this.yMargin,
      });

      graphFill = this.makePath(points);
      graphFill.classList.add('logs-graph-fill');

      this.graph.appendChild(graphFill);
      this.graph.appendChild(graphLine);
    }

    this.drawYTicks();
    this.drawXTicks();

    this.updateScrollBar();
  }

  timeToLabel(time) {
    const date = new Date(time);
    if (date.getHours() === 0 && date.getMinutes() === 0) {
      return `${date.getDate()}`;
    }
    let minutes = `${date.getMinutes()}`;
    if (minutes.length < 2) {
      minutes = `0${minutes}`;
    }
    return `${date.getHours()}:${minutes}`;
  }

  valueToLabel(value, bonusPlaces) {
    bonusPlaces = bonusPlaces || 0;
    let labelText;
    if (this.property.type === 'boolean') {
      labelText = this.propertyLabel(value);
    } else if (Math.floor(value) === value) {
      labelText = value.toFixed(0);
    } else {
      const places = Math.max(
        0,
        2 + bonusPlaces - Math.log(this.valueMax - this.valueMin) / Math.LN10);
      labelText = value.toFixed(places);
    }
    return labelText;
  }

  removeAll(selector) {
    this.elt.querySelectorAll(selector).forEach((child) => {
      child.parentNode.removeChild(child);
    });
  }

  drawYTicks() {
    if (this.property.type !== 'boolean') {
      const incForTenTicks =
        Math.pow(10, Math.floor(Math.log(this.valueMax - this.valueMin) /
                                Math.LN10) - 1);
      let value = this.valueMin + incForTenTicks;
      let i = 1;
      while (value < this.valueMax) {
        const y = this.valueToY(value);
        let tickLength = 5;
        if (i % 5 === 0) {
          tickLength *= 1.5;
        }
        // Make a tick
        const tick = this.makePath([
          {x: this.xStart, y},
          {x: this.xStart + tickLength, y},
        ]);
        tick.classList.add('logs-graph-tick');
        this.graph.appendChild(tick);

        value += incForTenTicks;
        i += 1;
      }
    }

    // Make a final tick at valueMax, nudge it by 1 due to 2px width
    const tick = this.makePath([
      {x: this.xStart - 1, y: this.valueToY(this.valueMax) - 1},
      {x: this.xStart + 10, y: this.valueToY(this.valueMax) - 1},
    ]);
    tick.classList.add('logs-graph-tick', 'logs-graph-tick-big');
    this.graph.appendChild(tick);

    let label = this.makeText(this.valueToLabel(this.valueMin),
                              this.xStart - 5,
                              this.valueToY(this.valueMin), 'end', 'middle');
    label.classList.add('logs-graph-label');
    this.graph.appendChild(label);

    label = this.makeText(this.valueToLabel(this.valueMax),
                          this.xStart - 5,
                          this.valueToY(this.valueMax), 'end', 'middle');
    label.classList.add('logs-graph-label');
    this.graph.appendChild(label);
  }

  drawXTicks() {
    const oneMinuteMs = 60 * 1000;
    const oneHourMs = 60 * oneMinuteMs;
    const oneDayMs = 24 * oneHourMs;

    const reasonableTicks = [
      oneDayMs, 12 * oneHourMs, oneHourMs, 15 * oneMinuteMs, 5 * oneMinuteMs,
      oneMinuteMs,
    ];

    let i;
    for (i = 1; i < reasonableTicks.length - 1; i++) {
      const trialTick = reasonableTicks[i];
      const tickWidth = this.timeToX(trialTick) - this.timeToX(0);
      if (tickWidth < 48) {
        break;
      }
    }

    const tickIncrement = reasonableTicks[i];
    const bigTickIncrement = reasonableTicks[i - 1];

    const tickWidth = this.timeToX(tickIncrement) - this.timeToX(0);

    const flooredStart = this.floorDate(
      new Date(this.start.getTime())).getTime();
    let time = flooredStart;
    while (time < this.end.getTime()) {
      if (time > this.start.getTime()) {
        const x = this.timeToX(time);
        let tickHeight = 5;
        if ((time - flooredStart) % bigTickIncrement === 0) {
          // Big label of date
          const text = this.timeToLabel(time);
          const label = this.makeText(text, x, this.height - this.yMargin + 2,
                                      'middle', 'hanging');
          label.classList.add('logs-graph-label');
          this.graph.appendChild(label);
          tickHeight *= 2;
        } else if (tickWidth > 48) {
          // Big label if the small ticks are wider than expected
          const text = this.timeToLabel(time);
          const label = this.makeText(text, x, this.height - this.yMargin + 2,
                                      'middle', 'hanging');
          label.classList.add('logs-graph-label');
          this.graph.appendChild(label);
        }
        // Make a tick
        const tick = this.makePath([
          {x, y: this.height - this.yMargin},
          {x, y: this.height - this.yMargin - tickHeight},
        ]);
        tick.classList.add('logs-graph-tick');
        this.graph.appendChild(tick);
      }

      time += tickIncrement;
    }
  }

  drawScrollBar() {
    const barHeight = 16;
    const barY = this.height + this.scrollHeight / 2 - barHeight / 2;

    this.scrollBar = document.createElementNS('http://www.w3.org/2000/svg',
                                              'rect');
    this.scrollBar.classList.add('logs-scroll-bar');
    this.scrollBar.setAttribute('x', this.xStart);
    this.scrollBar.setAttribute('y', barY);
    this.scrollBar.setAttribute('width', this.graphWidth);
    this.scrollBar.setAttribute('height', barHeight);
    this.graph.appendChild(this.scrollBar);

    this.scrollControl =
      document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.scrollControl.classList.add('logs-scroll-control');
    this.scrollControl.setAttribute('y', barY);
    this.scrollControl.setAttribute('height', barHeight);
    this.graph.appendChild(this.scrollControl);

    const equiTri = 1 / Math.sqrt(3);
    const buttonScale = 16;
    const margin = 8;
    const barCenter = barY + barHeight / 2;

    this.scrollButtonLeft = this.makePath([
      {x: this.xStart - buttonScale - margin, y: barCenter},
      {x: this.xStart - margin, y: barCenter - buttonScale * equiTri},
      {x: this.xStart - margin, y: barCenter + buttonScale * equiTri},
    ], true);
    this.scrollButtonLeft.classList.add('logs-scroll-button');
    this.scrollButtonLeft.addEventListener('click', this.scrollLeft);
    this.graph.appendChild(this.scrollButtonLeft);

    const barEnd = this.xStart + this.graphWidth + margin;
    this.scrollButtonRight = this.makePath([
      {x: barEnd + buttonScale, y: barCenter},
      {x: barEnd, y: barCenter - buttonScale * equiTri},
      {x: barEnd, y: barCenter + buttonScale * equiTri},
    ], true);
    this.scrollButtonRight.classList.add('logs-scroll-button');
    this.scrollButtonRight.addEventListener('click', this.scrollRight);
    this.graph.appendChild(this.scrollButtonRight);
  }

  updateScrollBar() {
    let controlStart = this.timeToX(this.start.getTime(),
                                    this.logStart.getTime(),
                                    this.logEnd.getTime());
    let controlEnd = this.timeToX(this.end.getTime(), this.logStart.getTime(),
                                  this.logEnd.getTime());

    // Make sure control is wide enough to tap
    if (controlEnd - controlStart < 16) {
      controlEnd = controlStart + 16;
      if (controlEnd > this.xStart + this.graphWidth) {
        controlEnd = this.xStart + this.graphWidth;
        controlStart = controlEnd - 16;
      }
    }

    this.scrollControl.setAttribute('x', controlStart);
    this.scrollControl.setAttribute('width', controlEnd - controlStart);
  }

  scrollLeft() {
    const width = this.end.getTime() - this.start.getTime();
    this.scroll(-width / 2);
  }

  scrollRight() {
    const width = this.end.getTime() - this.start.getTime();
    this.scroll(width / 2);
  }

  scroll(amount) {
    let newStart = this.start.getTime() + amount;
    let newEnd = this.end.getTime() + amount;
    const width = newEnd - newStart;
    if (amount < 0 && newStart < this.logStart.getTime()) {
      newStart = this.logStart.getTime();
      newEnd = newStart + width;
    } else if (amount > 0 && newEnd > this.logEnd.getTime()) {
      newEnd = this.logEnd.getTime();
      newStart = newEnd - width;
    }
    this.start = new Date(newStart);
    this.end = new Date(newEnd);
    this.redraw();
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
    date.setMilliseconds(0);
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
    if (Math.abs(time - nearestPoint.time) < closenessBuffer) {
      return nearestPoint;
    }
    return null;
  }

  constrainTime(time) {
    if (time < this.start.getTime()) {
      return this.start.getTime();
    } else if (time > this.end.getTime()) {
      return this.end.getTime();
    }
    return time;
  }

  onPointerDown(event) {
    event.preventDefault();

    if (event.button === RIGHT_MOUSE_BUTTON) {
      return;
    }

    if (event.target.classList.contains('logs-scroll-control')) {
      this.scrolling = true;
      this.dragging = false;
      const controlX = parseFloat(this.scrollControl.getAttribute('x'));
      this.scrollOffset = event.clientX - controlX;
    } else {
      const rect = this.graph.getBoundingClientRect();
      const localY = event.clientY - rect.top;
      if (localY > this.graphHeight + this.yMargin) {
        // Actually clicking the background
        return;
      }
      this.dragging = true;
      this.scrolling = false;
      this.dragStart = this.constrainTime(this.xToTime(event.clientX));
    }
  }

  onPointerMove(event) {
    event.preventDefault();
    if (this.dragging) {
      this.drawHighlight(event.clientX);
    } else if (this.scrolling) {
      let newX = event.clientX - this.scrollOffset;
      const scrollControlWidth =
        parseFloat(this.scrollControl.getAttribute('width'));
      const maxX = this.xStart + this.graphWidth - scrollControlWidth;
      if (newX < this.xStart) {
        newX = this.xStart;
      } else if (newX > maxX) {
        newX = maxX;
      }
      this.scrollControl.setAttribute('x', newX);
    } else {
      this.drawTooltip(event.clientX);
    }
  }

  drawHighlight(clientX) {
    const dragStartX = this.timeToX(this.dragStart);
    let minX = Math.min(dragStartX, clientX);
    let maxX = Math.max(dragStartX, clientX);

    minX = Math.max(minX, this.xStart);
    maxX = Math.min(maxX, this.graphWidth + this.xStart);

    this.selectionHighlight.setAttribute('x', minX);
    this.selectionHighlight.setAttribute('width', maxX - minX);
  }

  removeHighlight() {
    this.selectionHighlight.setAttribute('width', 0);
  }

  drawTooltip(clientX) {
    if (!this.property || !this.rawPoints || this.rawPoints.length === 0) {
      return;
    }
    const time = this.xToTime(clientX);
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
    const valueLabel = this.valueToLabel(point.value, 2);

    const unit = Utils.unitNameToAbbreviation(this.property.unit || '');
    this.tooltipValue.textContent = `${valueLabel} ${unit}`;

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

  onPointerLeave() {
    this.removeTooltip();
    this.removeHighlight();
    if (this.scrolling) {
      this.finishScrolling();
    }
    this.dragging = false;
    this.scrolling = false;
  }

  onPointerUp(event) {
    event.preventDefault();
    this.removeHighlight();

    if (this.scrolling) {
      this.finishScrolling();
    } else if (this.dragging) {
      this.dragging = false;
      const dragEnd = this.constrainTime(this.xToTime(event.clientX));
      if (Math.abs(dragEnd - this.dragStart) < 30 * 1000) {
        // Drag was way too small (<30s)
        return;
      }
      let newStart, newEnd;
      if (this.dragStart < dragEnd) {
        newStart = new Date(this.dragStart);
        newEnd = new Date(dragEnd);
      } else {
        newStart = new Date(dragEnd);
        newEnd = new Date(this.dragStart);
      }
      this.start = newStart;
      this.end = newEnd;
      this.redraw();
    }
    if (event.button === RIGHT_MOUSE_BUTTON) {
      this.start = this.logStart;
      this.end = this.logEnd;
      // TODO clip and then do a zoom out animation as well
      this.redraw();
    }
  }

  finishScrolling() {
    this.scrolling = false;
    const controlX = parseFloat(this.scrollControl.getAttribute('x'));
    const controlTime = this.xToTime(controlX, this.logStart.getTime(),
                                     this.logEnd.getTime());
    const delta = controlTime - this.start.getTime();
    this.scroll(delta);
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
