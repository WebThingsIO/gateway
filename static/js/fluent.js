const FluentDOM = require('@fluent/dom');
const Fluent = require('@fluent/bundle');

const availableLanguages = {
  'en-US': ['/fluent/en-US/main.ftl'],
  'es-MX': ['/fluent/es-MX/main.ftl'],
};

let bundle;

async function load() {
  // const links = document.querySelectorAll('link[rel="localization"]');
  let language = 'en-US'; // navigator.language;
  let links = availableLanguages[language];
  if (!links) {
    language = 'en-US';
    links = availableLanguages[language];
  }
  bundle = new Fluent.FluentBundle(language);
  for (const link of links) {
    try {
      const res = await fetch(link);
      const text = await res.text();
      bundle.addResource(new Fluent.FluentResource(text));
    } catch (e) {
      console.warn('Unable to download language pack', e);
    }
  }
}

async function *generateBundles(_resourceIds) {
  if (!bundle) {
    await load();
  }
  yield bundle;
}

const l10n = new FluentDOM.DOMLocalization([], generateBundles);

function init() {
  l10n.connectRoot(document.documentElement);
  l10n.translateRoots();
}

/**
 * @return {string|null} Translation of unit or null if not contained in bundle
 */
function getMessageStrict(id) {
  const obj = bundle.getMessage(id);
  if (!obj) {
    console.warn('Missing id', id);
    return null;
  }
  return obj.value;
}

/**
 * @return {string} Translation of unit or unit's id for debugging purposes
 */
function getMessage(id) {
  return getMessageStrict(id) || `<${id}>`;
}

module.exports = {
  load,
  l10n,
  init,
  getMessage,
  getMessageStrict,
};
