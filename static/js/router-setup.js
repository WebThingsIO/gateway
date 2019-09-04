const fluent = require('./fluent');

function setupForm() {
  const pass1 = document.getElementById('password');
  const pass2 = document.getElementById('password-confirm');

  function checkpass() {
    if (pass1.value !== pass2.value) {
      const message = fluent.getMessage('router-setup-password-mismatch');
      pass1.setCustomValidity(message);
      pass2.setCustomValidity(message);
    } else {
      pass1.setCustomValidity('');
      pass2.setCustomValidity('');
    }
  }

  pass1.addEventListener('input', checkpass);
  pass2.addEventListener('input', checkpass);
}

window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  fluent.load().then(() => {
    fluent.init();
    setupForm();
  });
});
