
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import imagesLoaded from 'imagesloaded';

import { gsap, Power3 } from 'gsap';
import _ from 'lodash';
import Cursor from './cursor';

const Main = {
  init() {
    const self = this;
    // Set scroll restoration to manual so the page doeesnt jump when we nav back
    const { history } = window;
    history.scrollRestoration = 'manual';

    // init custom cursor
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
            const me = this;
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
                self.setObserver();
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
          //   stop observing it after we add the class
          obs.unobserve(entry.target);
        }
      }));
    }, {
      threshold: 0.1,
    });
    const images = document.querySelectorAll('img');
    images.forEach((header) => {
      obs.observe(header);
    });
    // window.d = obs;
  },
};

export default Main;
