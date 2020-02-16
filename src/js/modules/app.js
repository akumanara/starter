import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import imagesLoaded from 'imagesloaded';

import debounce from 'lodash/debounce';
import Cursor from './cursor';
import {
  transitionEnter, transitionLeave, setPreloader,
} from './animations';


const loadImages = (next) => new Promise((resolve) => {
  const imgLoad = imagesLoaded(next.container);
  imgLoad.on('always', (instance) => {
    resolve();
  });
});

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

    window.addEventListener('resize', debounce(this.onResize, 150));
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
        leave: ({ current, next, trigger }) => transitionLeave(current),
        after: ({ current, next, trigger }) => loadImages(next)
          .then(() => transitionEnter(next)
            .then(() => this.onEveryPageLoad())),
      }],
    });
  }

  onEveryPageLoad() {
    this.cursor.initEvents();
    this.setObserver();
  }

  onFirstLoad() {
    this.setObserver();
  }


  onResize() {
    console.log('resized');
  }

  setObserver() {
    const images = document.querySelectorAll('img');
    images.forEach((header) => {
      this.observer.observe(header);
    });
  }
}

export default App;
