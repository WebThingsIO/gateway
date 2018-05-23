'use strict';

function ThingDetailLayout(parent, elements) {
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

ThingDetailLayout.prototype.doLayout = function() {
  let xScale = 300;
  let yScale = 300;

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

    this.elements[i].style.transform = `translate(${x}px, ${y}px)`;

    const line =
        document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.classList.add('thing-detail-layout-link');
    line.setAttribute('x1', xScale);
    line.setAttribute('y1', yScale);
    line.setAttribute('x2', x + xScale);
    line.setAttribute('y2', y + yScale);

    this.svg.appendChild(line);
  }
};

module.exports = ThingDetailLayout;
