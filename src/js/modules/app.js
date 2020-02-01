
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
    this.DOM = {
      main: document.querySelector('main'),
    };

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
        },
        after({ current, next, trigger }) {
          // i need to hook on the after element in order to wait for the images to load
          return self.loadImages()
            .then(() => transitionEnter(next)
              .then(() => self.onEveryPageLoad()));
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

  loadImages() {
    return new Promise((resolve) => {
      const imgLoad = imagesLoaded(this.DOM.main);
      imgLoad.on('always', (instance) => {
        resolve();
      });
    });
  }

  onResize() {
  }

  setObserver() {
    const images = document.querySelectorAll('img');
    images.forEach((header) => {
      this.observer.observe(header);
    });
  }
}

export default Main;
