import './modules/logger';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import imagesLoaded from 'imagesloaded';

import { gsap, Power3 } from 'gsap';
import Cursor from './modules/cursor';


const cursor = new Cursor(document.querySelector('.cursor'));

gsap.set('.loader', { y: '-100vh' });

// window.a = cursor;
// tell Barba to use the css module
// barba.use(barbaCss);
barba.use(barbaPrefetch);
// basic default transition (with no rules and minimal hooks)
barba.init({
  // debug: true,
  preventRunning: true,
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


// window.addEventListener('resize', () => {}, { passive: true });
