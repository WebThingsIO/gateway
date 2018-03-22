/* global API, Utils */

document.addEventListener('DOMContentLoaded', () => {
  let jwt = document.getElementById('jwt');
  jwt.value = API.jwt;

  let scope = document.getElementById('authorize-scope');
  init(scope.value);
});

function init(scope) {
  let readWrite = scope.indexOf(':readwrite') >= 0;
  let authorizeReadWrite = document.getElementById('authorize-readwrite');
  let authorizeRead = document.getElementById('authorize-read');
  let authorizeThings = document.getElementById('authorize-things');
  let authorizeButton = document.getElementById('authorize-button');
  let authorizeScope = document.getElementById('authorize-scope');
  let authorizeAllThings = document.getElementById('authorize-all-things');

  if (readWrite) {
    authorizeReadWrite.setAttribute('selected', '');
  } else {
    authorizeRead.setAttribute('selected', '');
  }

  let global = scope.split(':')[0] === '/things';

  if (global) {
    authorizeAllThings.setAttribute('checked', '');
  }

  fetch('/things', {
    headers: API.headers()
  }).then(res => {
    return res.json();
  }).then(things => {
    let checkboxIndex = 0;
    for (let thing of things) {
      let included = global || (scope.indexOf(thing.href) >= 0);
      let elt = document.createElement('li');
      elt.classList.add('authorize-thing');
      elt.dataset.href = Utils.escapeHtml(thing.href);
      elt.innerHTML = `
        <input id="authorize-thing-included-${checkboxIndex}"
          class="authorize-thing-included generic-checkbox"
          type="checkbox" ${included ? 'checked' : ''}
          ${global ? 'disabled' : ''}/>
        <label for="authorize-thing-included-${checkboxIndex}">
          ${Utils.escapeHtml(thing.name)}
        </label>`;
      checkboxIndex += 1;

      authorizeThings.appendChild(elt);
    }
  });


  authorizeAllThings.addEventListener('change', function() {
    let authorizeThings = document.querySelectorAll('.authorize-thing');
    for (let thingElt of authorizeThings) {
      let checkbox = thingElt.querySelector('.authorize-thing-included');
      if (authorizeAllThings.checked) {
        checkbox.checked = authorizeAllThings.checked;
        checkbox.disabled = true;
      } else {
        checkbox.disabled = false;
      }
    }
  });

  authorizeButton.addEventListener('click', function() {
    let readWrite = 'read';
    if (authorizeReadWrite.selected) {
      readWrite = 'readwrite';
    }

    let urls = [];
    // read scope from .authorize-thing
    if (authorizeAllThings.checked) {
      urls.push('/things');
    } else {
      let authorizeThings = document.querySelectorAll('.authorize-thing');
      for (let thingElt of authorizeThings) {
        if (thingElt.querySelector('.authorize-thing-included').checked) {
          urls.push(thingElt.dataset.href);
        }
      }
    }

    authorizeScope.value = urls.map(url => {
      return url + ':' + readWrite;
    }).join(' ');
  });

  authorizeButton.removeAttribute('disabled');
}
