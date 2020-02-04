
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import imagesLoaded from 'imagesloaded';

import _ from 'lodash';
import Cursor from './cursor';
import { transitionEnter, transitionLeave, setPreloader } from './animations';

const { history } = window;
class App {
  constructor() {
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

    window.addEventListener('resize', _.debounce(this.onResize, 150));
    setPreloader();
    this.setBarba();
    this.onFirstLoad();
  }

  setBarba() {
    const self = this;
    barba.use(barbaPrefetch);
    barba.init({
      debug: true,
      preventRunning: true,
      views: [
        {
          namespace: 'home',
          afterEnter(data) {
            console.log('afterEnter home');
          },
        },
        {
          namespace: 'about',
          afterEnter(data) {
            console.log('afterEnter about');
          },
        },
      ],
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
  }

  onEveryPageLoad() {
    console.log('onEveryPageLoad');
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

export default App;
