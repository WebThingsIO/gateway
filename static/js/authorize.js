const API = require('./api');
const fluent = require('./fluent');
const Utils = require('./utils');

document.addEventListener('DOMContentLoaded', () => {
  fluent.load().then(() => {
    fluent.init();

    const jwt = document.getElementById('jwt');
    jwt.value = API.jwt;

    const scope = document.getElementById('authorize-scope');
    init(scope.value);

    const backButton = document.getElementById('back-button');
    const params = new URLSearchParams(window.location.search);
    if (!params.has('client_id') || params.get('client_id') !== 'local-token') {
      backButton.classList.add('hidden');
    }
  });
});

function init(scope) {
  // promptMessage will be of the form:
  //   "<<name>> would like to access your gateway to <<function>> devices."
  // split that string on the <<name>> and <<function>> parts and insert the
  // existing nodes in the right places.
  const authorizeInfo = document.getElementById('authorize-info');
  const authorizeName = document.getElementById('authorize-name');
  const authorizeFunction = document.getElementById('authorize-function');
  const promptMessage = fluent.getMessage('authorize-prompt');

  let node1, node2;
  if (promptMessage.indexOf('<<function>>') <
      promptMessage.indexOf('<<name>>')) {
    authorizeInfo.insertBefore(authorizeFunction, authorizeName);
    node1 = authorizeFunction;
    node2 = authorizeName;
  } else {
    node1 = authorizeName;
    node2 = authorizeFunction;
  }

  const promptParts = promptMessage.split(/<<\w+>>/g);
  authorizeInfo.insertBefore(document.createTextNode(promptParts[0]), node1);
  authorizeInfo.insertBefore(document.createTextNode(promptParts[1]), node2);
  authorizeInfo.appendChild(document.createTextNode(promptParts[2]));

  // sourceMessage will be of the form:
  //   "from <<domain>>".
  // split that string on the <<domain>> part and insert the existing domain
  // node in the right place.
  const authorizeSubInfo = document.getElementById('authorize-sub-info');
  const authorizeDomain = document.getElementById('authorize-domain');
  const sourceMessage = fluent.getMessage('authorize-source');
  const sourceParts = sourceMessage.split('<<domain>>');
  authorizeSubInfo.insertBefore(
    document.createTextNode(sourceParts[0]),
    authorizeDomain
  );
  authorizeSubInfo.appendChild(document.createTextNode(sourceParts[1]));

  const readWrite = scope.indexOf(':readwrite') >= 0;
  const authorizeReadWrite = document.getElementById('authorize-readwrite');
  const authorizeRead = document.getElementById('authorize-read');
  const authorizeThings = document.getElementById('authorize-things');
  const authorizeButton = document.getElementById('authorize-button');
  const authorizeScope = document.getElementById('authorize-scope');
  const authorizeAllThings = document.getElementById('authorize-all-things');

  if (readWrite) {
    authorizeReadWrite.setAttribute('selected', '');
  } else {
    authorizeRead.setAttribute('selected', '');
  }

  const global = scope.split(':')[0] === '/things';

  if (global) {
    authorizeAllThings.setAttribute('checked', '');
  }

  API.getThings().then((things) => {
    let checkboxIndex = 0;
    for (const thing of things) {
      const included = global || (scope.indexOf(thing.href) >= 0);
      const elt = document.createElement('li');
      elt.classList.add('authorize-thing');
      elt.dataset.href = Utils.escapeHtml(thing.href);
      elt.innerHTML = `
        <input id="authorize-thing-included-${checkboxIndex}"
          class="authorize-thing-included generic-checkbox"
          type="checkbox" ${included ? 'checked' : ''}
          ${global ? 'disabled' : ''}/>
        <label for="authorize-thing-included-${checkboxIndex}">
          ${Utils.escapeHtml(thing.title)}
        </label>`;
      checkboxIndex += 1;

      authorizeThings.appendChild(elt);
    }
  });

  authorizeAllThings.addEventListener('change', () => {
    const authorizeThings = document.querySelectorAll('.authorize-thing');
    for (const thingElt of authorizeThings) {
      const checkbox = thingElt.querySelector('.authorize-thing-included');
      if (authorizeAllThings.checked) {
        checkbox.checked = authorizeAllThings.checked;
        checkbox.disabled = true;
      } else {
        checkbox.disabled = false;
      }
    }
  });

  authorizeButton.addEventListener('click', () => {
    let readWrite = 'read';
    if (authorizeReadWrite.selected) {
      readWrite = 'readwrite';
    }

    const urls = [];
    // read scope from .authorize-thing
    if (authorizeAllThings.checked) {
      urls.push('/things');
    } else {
      const authorizeThings = document.querySelectorAll('.authorize-thing');
      for (const thingElt of authorizeThings) {
        if (thingElt.querySelector('.authorize-thing-included').checked) {
          urls.push(thingElt.dataset.href);
        }
      }
    }

    authorizeScope.value = urls.map((url) => {
      return `${url}:${readWrite}`;
    }).join(' ');
  });

  authorizeButton.removeAttribute('disabled');
}
