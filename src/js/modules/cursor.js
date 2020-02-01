import { each } from 'lodash';
import gsap from 'gsap';


const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;

  posx = e.clientX;
  posy = e.clientY;
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
    this.mousePos = { x: 0, y: 0 };
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
    gsap.to(this.DOM.dot, 0, {
      x: this.mousePos.x - this.bounds.dot.width / 2,
      y: this.mousePos.y - this.bounds.dot.height / 2,
    });
    gsap.to(this.DOM.circle, 0.8, {
      x: this.mousePos.x - this.bounds.circle.width / 2,
      y: this.mousePos.y - this.bounds.circle.height / 2,
    });
    requestAnimationFrame(() => this.render());
  }

  enter() {
    gsap.to(this.DOM.circle, 0.8, {
      scale: 3,
    });
  }

  leave() {
    gsap.to(this.DOM.circle, 0.8, {
      scale: 1,
    });
  }

  click() {
    gsap.to(this.DOM.circle, 0.8, {
      scale: 1,
    });
  }
}
