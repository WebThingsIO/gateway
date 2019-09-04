const fluent = require('./fluent');

window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  fluent.load().then(() => {
    fluent.init();

    const gatewayLink = `<a class="gateway-link" href="http://${window.domain}"
      target="_blank" rel="noopener">${window.domain}</a>`;

    const title = document.querySelector('#title');
    const content = document.querySelector('#content');

    if (window.skipped) {
      title.innerText = fluent.getMessage('connecting-header-skipped');
      content.innerHTML = fluent.getMessage(
        'connecting-skipped',
        {'gateway-link': gatewayLink}
      );
    } else {
      title.innerText = fluent.getMessage('connecting-header');
      content.innerHTML = fluent.getMessage(
        'connecting-connect',
        {'gateway-link': gatewayLink}
      );
    }

    const warning = document.querySelector('#warning');
    warning.innerHTML = fluent.getMessage(
      'connecting-warning',
      {domain: window.domain}
    );
  });
});
