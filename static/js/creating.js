const fluent = require('./fluent');

window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  fluent.load().then(() => {
    fluent.init();

    const gatewayLink = `<a class="gateway-link" href="http://${window.domain}"
      target="_blank" rel="noopener">${window.domain}</a>`;
    const ipLink = `<a class="gateway-link" href="http://${window.ipAddr}"
      target="_blank" rel="noopener">${window.ipAddr}</a>`;

    const content = document.querySelector('#content');
    content.innerHTML = fluent.getMessage(
      'creating-content',
      {
        ssid: window.ssid,
        'gateway-link': gatewayLink,
        'ip-link': ipLink,
      }
    );
  });
});
