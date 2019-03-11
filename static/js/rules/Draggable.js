class Draggable {
  /**
   * A helper class for making Elements draggable
   * @constructor
   * @param {Element} elt - draggable element
   * @param {Function?} afterDown - listener for after the user starts a drag
   * @param {Function?} afterMove - listener for when the user moves during a
   *                                drag
   * @param {Function?} afterUp - listener for after the drag stops
   */
  constructor(elt, afterDown, afterMove, afterUp) {
    this.elt = elt;
    this.afterDown = afterDown;
    this.afterMove = afterMove;
    this.afterUp = afterUp;
    const parentRect = this.elt.parentNode.getBoundingClientRect();
    this.baseX = parentRect.left;
    this.baseY = parentRect.top;
    this.onDown = this.onDown.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onUp = this.onUp.bind(this);
    elt.addEventListener('mousedown', this.onDown);
    elt.addEventListener('touchstart', this.onDown);
  }

  /**
   * @param {MouseEvent|TouchEvent} event
   * @return {{clientX: number, clientY: number}}
   */
  getClientCoords(event) {
    if (event.type.startsWith('touch')) {
      return {
        clientX: event.changedTouches[0].clientX,
        clientY: event.changedTouches[0].clientY,
      };
    }
    return {
      clientX: event.clientX,
      clientY: event.clientY,
    };
  }

  onDown(event) {
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('touchmove', this.onMove);
    window.addEventListener('mouseup', this.onUp);
    window.addEventListener('touchend', this.onUp);
    event.preventDefault();

    if (this.afterDown) {
      const coords = this.getClientCoords(event);
      this.afterDown(coords.clientX, coords.clientY);
    }
  }

  onMove(event) {
    const coords = this.getClientCoords(event);
    const x = coords.clientX - this.baseX;
    const y = coords.clientY - this.baseY;

    this.elt.style.transform = `translate(${x}px,${y}px)`;
    if (this.afterMove) {
      this.afterMove(coords.clientX, coords.clientY, x, y);
    }
  }

  onUp(event) {
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('touchmove', this.onMove);
    window.removeEventListener('mouseup', this.onUp);
    window.removeEventListener('touchend', this.onUp);
    if (this.afterUp) {
      const coords = this.getClientCoords(event);
      this.afterUp(coords.clientX, coords.clientY);
    }
  }
}

module.exports = Draggable;
