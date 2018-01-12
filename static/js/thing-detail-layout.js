(function() {

function ThingDetailLayout(elements) {
  this.elements = elements;

  const scale = Math.min(300, window.innerWidth / 2);

  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('thing-detail-layout-links');
  svg.setAttribute('width', scale * 2);
  svg.setAttribute('height', scale * 2);

  for (let i = 0; i < elements.length; i++) {
    let angle = i/elements.length * 2 * Math.PI;
    let x = scale * Math.cos(angle);
    let y = scale * Math.sin(angle);

    this.elements[i].style.transform = `translate(${x}px, ${y}px)`;

    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.classList.add('thing-detail-layout-link');
    line.setAttribute('x1', scale);
    line.setAttribute('y1', scale);
    line.setAttribute('x2', x + scale);
    line.setAttribute('y2', y + scale);

    svg.appendChild(line);
  }

  let things = document.getElementById('things');
  things.insertBefore(svg, things.firstChild);
}

window.ThingDetailLayout = ThingDetailLayout;

})();
