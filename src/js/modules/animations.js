import { gsap, Power3 } from 'gsap';

const transitionLeave = (current) => new Promise((resolve) => {
  const tl = gsap.timeline();
  tl.to(current.container, {
    duration: 0.6,
    autoAlpha: 0,
    y: '2vh',
    ease: Power3.easeInOut,
  });

  tl.fromTo('.loader', { y: '-100vh' }, {
    y: '0',
    duration: 0.6,
    ease: Power3.easeInOut,
    onComplete() {
      console.log('resolved transitionLeave');
      resolve();
    },
  }, '-=.3');
});

const transitionEnter = (next) => new Promise((resolve) => {
  const tl = gsap.timeline();
  tl.fromTo('.loader', { y: '0' }, {
    y: '100vh',
    duration: 0.6,
    ease: Power3.easeInOut,
  });
  tl.fromTo(next.container, { autoAlpha: 0, y: '2vh' }, {
    duration: 0.6,
    autoAlpha: 1,
    y: '0',
    ease: Power3.easeInOut,
    onComplete() {
      console.log('resolved transitionEnter');
      resolve();
    },
  }, '-=.6');
});

export { transitionLeave, transitionEnter };
