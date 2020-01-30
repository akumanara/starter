// import './modules/logger';
import * as Sentry from '@sentry/browser';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import imagesLoaded from 'imagesloaded';

import { gsap, Power3 } from 'gsap';
import _ from 'lodash';
import Cursor from './modules/cursor';

// Set up js error logging to sentry io
Sentry.init({
  dsn: 'https://5111e3821bed469591e5e825abecc24f@sentry.io/2094113',
  release: 'starter@0.1',
});
const { history } = window;
history.scrollRestoration = 'manual';

const Main = {
  init() {
    const cursor = new Cursor(document.querySelector('.cursor'));

    // preloader
    gsap.set('.loader', { y: '-100vh' });
    barba.use(barbaPrefetch);
    this.setObserver();
    window.addEventListener('resize', _.debounce(Main.resize, 150));

    // Intersection observer
    // barba.use(barbaCss);
    // basic default transition (with no rules and minimal hooks)
    barba.init({
      // debug: true,
      preventRunning: true,
      transitions: [
        {
          leave({ current, next, trigger }) {
            return new Promise((resolve) => {
              cursor.destroyEvents();
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
                  resolve();
                },
              }, '-=.3');
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
                const tl = gsap.timeline();
                tl.fromTo('.loader', { y: '0' }, {
                  y: '100vh',
                  duration: 0.6,
                  ease: Power3.easeInOut,
                });
                tl.fromTo(next.container, { autoAlpha: 0, y: '2vh' }, {
                  duration: 0.6, autoAlpha: 1, y: '0', ease: Power3.easeInOut,
                }, '-=.6');

                cursor.initEvents();
                resolve();
              });
            });
          },
        },
      ],
    });
  },
  resize() {
    console.log('resized');
  },
  setObserver() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(((entry) => {
        if (entry.intersectionRatio > 0.1) {
          entry.target.classList.add('in-view');
        }
      }));
    }, {
      threshold: 0.1,
    });
    const images = document.querySelectorAll('img');
    images.forEach((header) => {
      obs.observe(header);
    });
  },
};


const windowLoad = new Promise(((resolve) => {
  window.addEventListener('load', () => {
    resolve();
  });
}));
const imagesLoadedP = new Promise(((resolve) => {
  const imgLoad = imagesLoaded(document.querySelector('body'));
  imgLoad.on('always', () => {
    // console.log('ALWAYS - all images have been loaded');
    resolve();
  });
}));
Promise.all([windowLoad, imagesLoadedP, window.preloaderDone]).then(() => {
  // console.log('window load + images loaded');
  Main.init();
});

const style = [
  'background: #d33d27;',
  'color: white',
  'padding: 5px 20px',
  'font-weight: 400',
  'line-height: 25px',
].join(';');
console.log('%cMade by AntMoves | Explore more projects @ AntMoves.com', style);
