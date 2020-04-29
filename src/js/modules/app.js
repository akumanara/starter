import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import imagesLoaded from 'imagesloaded';
import * as PIXI from 'pixi.js';
import { Vector } from 'p5';

import debounce from 'lodash/debounce';
import Cursor from './cursor';
import {
  transitionEnter, transitionLeave, setPreloader,
} from './animations';

const MathUtils = {
  scale: (num, in_min, in_max, out_min, out_max) => (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min,
  lineEq: (y2, y1, x2, x1, currentVal) => {
    // y = mx + b
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return m * currentVal + b;
  },
  lerp: (a, b, n) => (1 - n) * a + n * b,
  getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2),
};

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


    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application(800, 600);
    app.ticker.speed = 2;

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(app.view);
    app.stage.interactive = true;
    let dragging = false;


    const artboard = new PIXI.Sprite();
    artboard.x = app.screen.width / 2;
    artboard.y = app.screen.width / 2;
    artboard.width = app.screen.width;
    artboard.height = app.screen.width;
    artboard.anchor.set(0.5);

    artboard.buttonMode = true;
    artboard.interactive = true;

    app.stage.addChild(artboard);

    // draw a circle
    const graphics = new PIXI.Graphics();

    // graphics.anchor.set(0.5);
    app.stage.addChild(graphics);
    let startingMouse;
    let sMouse;


    app.stage.on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);


    const settings = {
      ink: 5000,
      drawMultiplier: 20,
      minBrushSize: 0.5,
      maxBrushSize: 0.7,
    };

    let ink;

    function onDragStart(event) {
      ink = settings.ink;
      dragging = true;
      startingMouse = app.renderer.plugins.interaction.mouse.global;
      sMouse = new Vector(startingMouse.x, startingMouse.y);
    }

    function onDragEnd() {
      dragging = false;
      window.setTimeout(() => {
        app.stage.removeChildren(1, app.stage.children.length);
      }, 500);
    }
    function onDragMove() {
      // if (dragging) {
      //   startingMouse = app.renderer.plugins.interaction.mouse.global;
      //   sMouse = new Vector(startingMouse.x, startingMouse.y);
      // }
    }


    app.ticker.add(() => {
      if (dragging && ink > 0) {
        const newPosition = app.renderer.plugins.interaction.mouse.global;
        const m = new Vector(newPosition.x, newPosition.y);

        const delta = Vector.sub(m, sMouse);
        console.log(`delta: ${delta}`);
        const dis = delta.mag();

        let numDraws = dis || 1;
        console.log(numDraws);
        numDraws *= settings.drawMultiplier;

        for (let i = 0; i < numDraws; i++) {
          if (!(Math.random() > 0.75)) {
            const ipos = Vector.lerp(sMouse, m, i / numDraws);
            const b = PIXI.Sprite.from('images/b.png');
            b.anchor.set(0.5);
            b.x = ipos.x;
            b.y = ipos.y;
            b.scale.set(MathUtils.scale(ink, 0, settings.ink, settings.minBrushSize, settings.maxBrushSize));
            app.stage.addChild(b);
            sMouse = new Vector(ipos.x, ipos.y);
            ink--;
          }
        }
      }
    });


    // // load the texture we need
    // app.loader.add('bunny', 'images/bunny.png').load((loader, resources) => {
    //   // This creates a texture from a 'bunny.png' image
    //   const bunny = new PIXI.Sprite(resources.bunny.texture);

    //   // Setup the position of the bunny
    //   bunny.x = app.renderer.width / 2;
    //   bunny.y = app.renderer.height / 2;

    //   // Rotate around the center
    //   bunny.anchor.x = 0.5;
    //   bunny.anchor.y = 0.5;

    //   // Add the bunny to the scene we are building
    //   app.stage.addChild(bunny);

    //   // Listen for frame updates
    //   app.ticker.add(() => {
    //     // each frame we spin the bunny around a bit
    //     bunny.rotation += 0.01;
    //   });


    //   app.stage.on('pointerdown', (e) => {
    //     console.log(e);
    //   });
    // });
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
