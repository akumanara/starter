
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import imagesLoaded from 'imagesloaded';

import { gsap, Power3 } from 'gsap';
import _ from 'lodash';
import Cursor from './cursor';
import { transitionEnter, transitionLeave } from './animations';

const { history } = window;
class Main {
  constructor() {
    const self = this;
    history.scrollRestoration = 'manual';
    this.cursor = new Cursor(document.querySelector('.cursor'));
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(((entry) => {
        if (entry.intersectionRatio > 0.1) {
          entry.target.classList.add('in-view');
          //   stop observing it after we add the class
          this.observer.unobserve(entry.target);
        }
      }));
    }, {
      threshold: 0.1,
    });

    // preloader set
    gsap.set('.loader', { y: '-100vh' });
    // Added resize
    window.addEventListener('resize', _.debounce(this.onResize, 150));

    barba.use(barbaPrefetch);
    barba.init({
      debug: true,
      preventRunning: true,
      transitions: [{
        leave({ current, next, trigger }) {
          return transitionLeave(current);
          // return new Promise((resolove) => { resolove(); });
        },
        enter({ current, next, trigger }) {
          return new Promise((resolve) => {
            const imgLoad = imagesLoaded(document.querySelector('main'));
            imgLoad.on('always', (instance) => {
              transitionEnter(next).then(resolve());
            });
          });
        },
        after() {
          self.onEveryPageLoad();
        },
      }],
    });
    this.onFirstLoad();
  }

  onEveryPageLoad() {
    this.cursor.initEvents();
    this.setObserver();
  }

  onFirstLoad() {
    this.setObserver();
  }

  onResize() {
  }

  setObserver() {
    const images = document.querySelectorAll('img');
    images.forEach((header) => {
      this.observer.observe(header);
    });
  }

  enterAnimation(current, next, trigger) {
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

        this.onEveryPageLoad();
        resolve();
      });
    });
  }
}

export default Main;
