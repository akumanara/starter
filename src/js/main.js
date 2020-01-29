import barba from '@barba/core';
import { gsap, Power3 } from 'gsap';
import Cursor from './modules/cursor';


const cursor = new Cursor(document.querySelector('.cursor'));

gsap.set('.loader', { y: '-100vh' });

window.a = cursor;
// basic default transition (with no rules and minimal hooks)
barba.init({
  transitions: [
    {
      leave({ current, next, trigger }) {
        return new Promise((resolve) => {
          cursor.destroyEvents();
          gsap.fromTo('.loader', { y: '-100vh' }, {
            y: '0',
            duration: 0.6,
            ease: Power3.easeInOut,
            onComplete() {
              resolve();
            },
          });
        });
      },
      after({ current, next, trigger }) {
        return new Promise((resolve) => {
          gsap.fromTo('.loader', { y: '0' }, {
            y: '100vh',
            duration: 0.6,
            ease: Power3.easeInOut,
          });
          cursor.initEvents();
          resolve();
        });
      },
    },
  ],
});

// dummy example to illustrate rules and hooks
// barba.init({
//   transitions: [
//     {
//       name: 'dummy-transition',

//       // apply only when leaving `[data-barba-namespace="home"]`
//       from: 'home',

//       // apply only when transitioning to `[data-barba-namespace="products | contact"]`
//       to: {
//         namespace: ['products', 'contact'],
//       },

//       // apply only if clicked link contains `.cta`
//       custom: ({ current, next, trigger }) =
// > trigger.classList && trigger.classList.contains('cta'),

//       // do leave and enter concurrently
//       sync: true,

//       // available hooks…
//       beforeOnce() { },
//       once() { },
//       afterOnce() { },
//       beforeLeave() { },
//       leave() { },
//       afterLeave() { },
//       beforeEnter() { },
//       enter() { },
//       afterEnter() { },
//     },
//   ],
// });


// window.addEventListener('resize', () => {}, { passive: true });
