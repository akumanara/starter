import * as Sentry from '@sentry/browser';
import Sniffer from 'sniffer';
import imagesLoaded from 'imagesloaded';
import App from './modules/app';


// Set up js error logging to sentry io
Sentry.init({
  dsn: 'https://5111e3821bed469591e5e825abecc24f@sentry.io/2094113',
  release: 'starter@0.1',
});

Sniffer.addClasses(document.documentElement);
// Set 2 Promises before we init Main. Images and Window Load
const windowLoad = new Promise(((resolve) => {
  window.addEventListener('load', () => {
    resolve();
  });
}));
const imagesLoadedP = new Promise(((resolve) => {
  const imgLoad = imagesLoaded(document.querySelector('body'));
  imgLoad.on('always', () => {
    resolve();
  });
}));
Promise.all([windowLoad, imagesLoadedP, window.preloaderDone]).then(() => {
  /* eslint-disable-next-line no-new */
  new App();
});

const style = [
  'background: #d33d27;',
  'color: white',
  'padding: 5px 20px',
  'font-weight: 400',
  'line-height: 25px',
].join(';');
/* eslint-disable-next-line no-console */
console.log('%cMade by AntMoves | Explore more projects @ AntMoves.com', style);
