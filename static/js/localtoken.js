const hljs = require('highlightjs/highlight.pack.min');

for (const origin of document.querySelectorAll('.origin')) {
  origin.textContent = window.location.origin;
}

if (!window.location.origin.endsWith('.mozilla-iot.org')) {
  document.body.classList.add('insecure');
}

hljs.initHighlightingOnLoad();
