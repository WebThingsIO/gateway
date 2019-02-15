// const Thing = require('../thing');

class Log {
  constructor(thingId, propertyId) {
    this.thingId = thingId;
    this.propertyId = propertyId;
    this.start = new Date(Date.now() - 7 * 24 * 60 * 60);
    this.end = new Date();

    this.margin = 20;
    this.xStart = 120 + 2 * this.margin;
    this.width = window.innerWidth - 2 * this.margin;
    this.height = 120;
    this.graphHeight = this.height - 2 * this.margin;
    this.graphWidth = this.width - this.xStart - this.margin;

    this.elt = document.createElement('div');
    this.elt.classList.add('logs-log-container');
    this.drawSkeleton();
    this.reload();
  }

  drawSkeleton() {
    // Get in the name and webcomponent
    const name = document.createElement('h3');
    name.classList.add('logs-log-name');
    name.textContent = `${this.thingId}.${this.propertyId}`;
    const thingContainer = document.createElement('div');
    // new Thing(thingContainer); // TODO

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('logs-log-info');
    infoContainer.appendChild(name);
    infoContainer.appendChild(thingContainer);
    this.elt.appendChild(infoContainer);

    this.graph = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.graph.classList.add('logs-graph');
    this.graph.style.width = `${this.width}px`;
    this.graph.style.height = `${this.height}px`;

    const axesPath = this.makePath([
      {x: this.xStart, y: this.margin},
      {x: this.xStart, y: this.height - this.margin},
      {x: this.width - this.margin, y: this.height - this.margin},
    ]);
    axesPath.classList.add('logs-graph-axes');

    this.graph.appendChild(axesPath);

    const yAxisLabel = this.makeText('W', this.xStart - this.margin / 2,
                                     this.height / 2, 'end');
    yAxisLabel.classList.add('logs-graph-label');
    // const timeLabels = this.makeText('why', (this.xStart + this.width -
    // this.margin) / 2, this.height / 2, 'left');

    this.graph.appendChild(yAxisLabel);

    // Draw axes
    // Draw labels if applicable
    this.elt.appendChild(this.graph);
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

  makeText(text, x, y, anchor) {
    const elt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    elt.textContent = text;
    elt.setAttribute('text-anchor', anchor);
    elt.setAttribute('x', x);
    elt.setAttribute('y', y);
    return elt;
  }

  async reload() {
    await this.load();
    this.redrawLog();
    // fetch data render graph
  }

  async load() {
    console.log('waaaa');
  }

  redrawLog() {
    // Determine max and min
    const yMin = 0; // this.property.min || min_of_all_data;
    const yMax = 1.1; // this.property.max || max_of_all_data;
    const yScale = (y) => {
      return this.height - this.margin - (y - yMin) / (yMax - yMin) *
        this.graphHeight;
    };

    const startTime = this.start.getTime();
    const endTime = this.end.getTime();

    const xScale = (x) => {
      return (x - startTime) / (endTime - startTime) * this.graphWidth +
        this.xStart;
    };

    const rawPoints = [];
    for (let i = 0; i < 100; i++) {
      rawPoints.push({
        value: Math.random() / 10 + Math.abs(Math.sin(i / 10)),
        date: new Date(Math.floor((i / 100) * (endTime - startTime) +
                                  startTime)),
      });
    }

    const points = rawPoints.map((raw) => {
      return {
        x: xScale(raw.date.getTime()),
        y: yScale(raw.value),
      };
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
}

module.exports = Log;
