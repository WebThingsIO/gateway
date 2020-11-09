const fluent = require('./fluent');
const hljs = require('highlight.js');

window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  fluent.load().then(() => {
    fluent.init();

    for (const origin of document.querySelectorAll('.origin')) {
      origin.textContent = window.location.origin;
    }

    if (!window.location.origin.endsWith('.webthings.io')) {
      document.body.classList.add('insecure');
    }

    hljs.initHighlighting();
  });

  const button = document.getElementById('copy-token-button');
  const token = document.getElementById('token');
  button.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    textarea.textContent = token.innerText;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (_) {
      // pass
    }

    document.body.removeChild(textarea);
  });
});
