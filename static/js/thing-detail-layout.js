/* globals d3 */

(function() {

const svgWidth = 640;
const svgHeight = 640;

function ThingDetailLayout(elements) {
  this.elements = elements;

  let svg = d3.select('#things').insert('svg', ':first-child')
    .attr('class', 'thing-detail-layout-links')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  this.force = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(0, 0));

  this.nodes = new Array(elements.length);

  for (let i = 0; i < elements.length; i++) {
    let angle = i/elements.length * 2 * Math.PI;
    this.nodes[i] = {
      x: 10 * Math.cos(angle),
      y: 10 * Math.sin(angle)
    };
  }

  this.force.nodes(this.nodes);

  this.link = svg.selectAll('.link')
    .data(this.nodes)
    .enter()
      .append('line')
      .attr('class', 'thing-detail-layout-link');
  this.link.attr('x1', svgWidth / 2);
  this.link.attr('y1', svgHeight / 2);

  this.update = this.update.bind(this);
}

function getX(node) {
  return node.x + svgWidth / 2;
}

function getY(node) {
  return node.y + svgHeight / 2;
}

function getTransform(node) {
  return 'translate(' + node.x + 'px, ' + node.y + 'px)';
}

ThingDetailLayout.prototype.update = function() {
  this.link.attr('x2', getX);
  this.link.attr('y2', getY);
  for (let i = 0; i < this.nodes.length; i++) {
    this.elements[i].style.transform = getTransform(this.nodes[i]);
  }

  window.requestAnimationFrame(this.update);
};

window.ThingDetailLayout = ThingDetailLayout;

})();
