import barba from '@barba/core';
import Cursor from './modules/cursor';


const cursor = new Cursor(document.querySelector('.cursor'));

// basic default transition (with no rules and minimal hooks)
barba.init({
  transitions: [
    {
      leave({ current, next, trigger }) {
        // do something with `current.container` for your leave transition
        // then return a promise or use `this.async()`
      },
      enter({ current, next, trigger }) {
        // do something with `next.container` for your enter transition
        // then return a promise or use `this.async()`
        cursor.initEvents();
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
