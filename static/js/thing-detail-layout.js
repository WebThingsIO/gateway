(function() {

function ThingDetailLayout(elements) {
  this.elements = elements;
  this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  this.svg.classList.add('thing-detail-layout-links');


  let things = document.getElementById('things');
  things.insertBefore(this.svg, things.firstChild);

  this.doLayout = this.doLayout.bind(this);

  this.doLayout();

  window.addEventListener('resize', this.doLayout);
}

ThingDetailLayout.prototype.doLayout = function() {
  let scale = 300;
  let angleStart = 0;

  if (window.innerWidth < 680) {
    scale = Math.max(130, window.innerWidth / 2 - 30);
    angleStart = -0.7;
  }

  this.svg.setAttribute('width', scale * 2);
  this.svg.setAttribute('height', scale * 2);
  this.svg.innerHTML = '';

  for (let i = 0; i < this.elements.length; i++) {
    let angle = i/this.elements.length * 2 * Math.PI + angleStart;
    let x = scale * Math.cos(angle);
    let y = scale * Math.sin(angle);

    this.elements[i].style.transform = `translate(${x}px, ${y}px)`;

    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.classList.add('thing-detail-layout-link');
    line.setAttribute('x1', scale);
    line.setAttribute('y1', scale);
    line.setAttribute('x2', x + scale);
    line.setAttribute('y2', y + scale);

    this.svg.appendChild(line);
  }
}

window.ThingDetailLayout = ThingDetailLayout;

})();
