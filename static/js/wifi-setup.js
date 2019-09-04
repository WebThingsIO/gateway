const fluent = require('./fluent');

function setupForm() {
  function selectssid(event, ssid, passwordRequired) {
    event.preventDefault();
    document.getElementById('ssid').value = ssid;

    if (passwordRequired) {
      document.getElementById('step1').style.display = 'none';
      document.getElementById('step2').style.display = 'block';
      document.getElementById('selected-network').innerText = ssid;
      document.getElementById('wordmark').style.display = 'none';
    } else {
      document.getElementById('mainform').submit();
    }
  }

  function back(event) {
    event.preventDefault();
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('wordmark').style.display = 'block';
  }

  function skip(event) {
    event.preventDefault();
    document.getElementById('skip').value = '1';
    document.getElementById('mainform').submit();
  }

  let mask = true;
  function displayPassword() {
    const tbx = document.getElementsByName('password')[0];
    if (mask === true) {
      mask = false;
      tbx.setAttribute('type', 'text');
    } else {
      mask = true;
      tbx.setAttribute('type', 'password');
    }
  }

  document.querySelectorAll('#maindiv > button').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      selectssid(ev, btn.dataset.ssid, btn.dataset.passwordRequired === 'true');
    });
  });

  document.querySelector('#skip-button').addEventListener('click', skip);
  document.querySelector('#back-button').addEventListener('click', back);
  document.querySelector('#showpassword').addEventListener('click',
                                                           displayPassword);
}

window.addEventListener('load', function app_onLoad() {
  window.removeEventListener('load', app_onLoad);
  fluent.load().then(() => {
    fluent.init();
    setupForm();
  });
});
