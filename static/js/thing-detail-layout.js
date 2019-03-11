'use strict';

class ThingDetailLayout {
  constructor(parent, elements) {
    this.elements = elements;
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('thing-detail-layout-links');


    const things = document.getElementById('things');
    things.insertBefore(this.svg, things.firstChild);

    this.doLayout = this.doLayout.bind(this);

    this.doLayout();

    parent.registerEventListener(window, 'resize',
                                 this.doLayout);
  }

  /**
   * Adjust the X and Y coordinates such that the line ends on the outer radius
   * of the circular icon.
   *
   * @param {number} angle - The calculated angle of the line
   * @param {number} radius - The radius of the circular icon
   * @return {Object} Object containing adjustments as such: {x, y}
   */
  adjustXY(angle, radius) {
    let x = 0, y = 0;
    if (angle < (Math.PI / 2)) {
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    } else if (angle < Math.PI) {
      const theta = Math.PI - angle;
      x = -(Math.cos(theta) * radius);
      y = Math.sin(theta) * radius;
    } else if (angle < (3 * Math.PI / 2)) {
      const theta = (3 * Math.PI / 2) - angle;
      x = -(Math.sin(theta) * radius);
      y = -(Math.cos(theta) * radius);
    } else {
      const theta = (2 * Math.PI) - angle;
      x = Math.cos(theta) * radius;
      y = -(Math.sin(theta) * radius);
    }

    return {x, y};
  }

  doLayout() {
    let xScale = 300;
    let yScale = 300;

    const centerRadius = 64;
    const outerRadius = 51;

    const angleStart = 0;

    const circlePadding = 70;

    const limitedXScale = window.innerWidth / 2 - circlePadding;
    if (limitedXScale < xScale) {
      xScale = Math.max(120, limitedXScale);
    }

    const limitedYScale = (window.innerHeight - 96) / 2 - circlePadding;
    // The title bar takes up 9.6rem from the top
    if (limitedYScale < yScale) {
      yScale = Math.max(135, limitedYScale);
    }

    this.svg.setAttribute('width', xScale * 2);
    this.svg.setAttribute('height', yScale * 2);
    this.svg.innerHTML = '';

    for (let i = 0; i < this.elements.length; i++) {
      const angle = i / this.elements.length * 2 * Math.PI + angleStart;
      const x = xScale * Math.cos(angle);
      const y = yScale * Math.sin(angle);

      let actualAngle = Math.atan2(y, x);
      if (actualAngle < 0) {
        actualAngle += 2 * Math.PI;
      }

      const point1Adjust = this.adjustXY(actualAngle, centerRadius);
      const point2Adjust = this.adjustXY(
        (actualAngle + Math.PI) % (2 * Math.PI),
        outerRadius
      );

      this.elements[i].style.transform = `translate(${x}px, ${y}px)`;

      const line =
          document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.classList.add('thing-detail-layout-link');
      line.setAttribute('x1', xScale + point1Adjust.x);
      line.setAttribute('y1', yScale + point1Adjust.y);
      line.setAttribute('x2', x + xScale + point2Adjust.x);
      line.setAttribute('y2', y + yScale + point2Adjust.y);

      this.svg.appendChild(line);
    }
  }
}

module.exports = ThingDetailLayout;
