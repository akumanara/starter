import barba from '@barba/core';
import barbaCss from '@barba/css';
import imagesLoaded from 'imagesloaded';

import { gsap, Power3 } from 'gsap';
import Cursor from './modules/cursor';


const cursor = new Cursor(document.querySelector('.cursor'));

gsap.set('.loader', { y: '-100vh' });

// window.a = cursor;
// tell Barba to use the css module
// barba.use(barbaCss);
// basic default transition (with no rules and minimal hooks)
barba.init({
  cacheIgnore: true,
  prefetchIgnore: true,
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
          const imgP = new Promise((resolve) => {
            const imgLoad = imagesLoaded(document.querySelector('main'));
            imgLoad.on('always', (instance) => {
              resolve();
            });
          });

          imgP.then(() => {
            gsap.fromTo('.loader', { y: '0' }, {
              y: '100vh',
              duration: 0.6,
              ease: Power3.easeInOut,
            });
            cursor.initEvents();
            resolve();
          });
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
