const fluent = require('./fluent');
const hljs = require('highlightjs/highlight.pack.min');

window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  fluent.load().then(() => {
    fluent.init();

    for (const origin of document.querySelectorAll('.origin')) {
      origin.textContent = window.location.origin;
    }

    if (!window.location.origin.endsWith('.mozilla-iot.org')) {
      document.body.classList.add('insecure');
    }

    hljs.initHighlightingOnLoad();
  });
});
