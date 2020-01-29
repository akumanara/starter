import { each } from 'lodash';
import lerp from './utils';


const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;
  //   if (!e) { e = window.event; }
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  return { x: posx, y: posy };
};

export default class {
  constructor(el) {
    this.DOM = { el };
    this.DOM.dot = this.DOM.el.querySelector('.cursor__inner--dot');
    this.DOM.circle = this.DOM.el.querySelector('.cursor__inner--circle');
    this.bounds = {
      dot: this.DOM.dot.getBoundingClientRect(),
      circle: this.DOM.circle.getBoundingClientRect(),
    };
    this.scale = 1;
    this.opacity = 1;
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { dot: { x: 0, y: 0 }, circle: { x: 0, y: 0 } };
    this.lastScale = 1;
    this.lastOpacity = 1;
    this.elements = [];

    this.enter = this.enter.bind(this);
    this.leave = this.leave.bind(this);
    this.click = this.click.bind(this);

    this.mouseMoveEvent();
    this.initEvents();
    requestAnimationFrame(() => this.render());
  }

  initEvents() {
    this.elements = document.querySelectorAll('a');

    each(this.elements, (element) => {
      element.addEventListener('mouseenter', this.enter);
      element.addEventListener('mouseleave', this.leave);
      element.addEventListener('click', this.click);
    });
  }


  destroyEvents() {
    this.elements = document.querySelectorAll('a');
    each(this.elements, (element) => {
      element.removeEventListener('mouseenter', this.enter);
      element.removeEventListener('mouseleave', this.leave);
      element.removeEventListener('click', this.click);
    });
  }

  mouseMoveEvent() {
    window.addEventListener('mousemove', (ev) => { this.mousePos = getMousePos(ev); });
  }

  render() {
    this.lastMousePos.dot.x = lerp(
      this.lastMousePos.dot.x,
      this.mousePos.x - this.bounds.dot.width / 2, 1,
    );
    this.lastMousePos.dot.y = lerp(
      this.lastMousePos.dot.y,
      this.mousePos.y - this.bounds.dot.height / 2, 1,
    );
    this.lastMousePos.circle.x = lerp(
      this.lastMousePos.circle.x,
      this.mousePos.x - this.bounds.circle.width / 2, 0.05,
    );
    this.lastMousePos.circle.y = lerp(
      this.lastMousePos.circle.y,
      this.mousePos.y - this.bounds.circle.height / 2, 0.05,
    );
    this.lastScale = lerp(this.lastScale, this.scale, 0.1);
    this.lastOpacity = lerp(this.lastOpacity, this.opacity, 0.1);
    this.DOM.dot.style.transform = `translateX(${(this.lastMousePos.dot.x)}px) translateY(${this.lastMousePos.dot.y}px)`;
    this.DOM.circle.style.transform = `translateX(${(this.lastMousePos.circle.x)}px) translateY(${this.lastMousePos.circle.y}px) scale(${this.lastScale})`;
    this.DOM.circle.style.opacity = this.lastOpacity;
    requestAnimationFrame(() => this.render());
  }

  enter() {
    this.scale = 2.7;
  }

  leave() {
    this.scale = 1;
  }

  click() {
    this.scale = 1;
  }
}
