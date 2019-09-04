const FluentDOM = require('@fluent/dom');
const Fluent = require('@fluent/bundle');

const availableLanguages = {
  'en-US': ['/fluent/en-US/main.ftl'],
  // 'es-MX': ['/fluent/es-MX/main.ftl'],
  en: ['/fluent/en-US/main.ftl'],
  it: ['/fluent/it/main.ftl'],
};

let bundle;

async function load() {
  let language = navigator.language;
  if (!availableLanguages.hasOwnProperty(language)) {
    const primary = language.split('-')[0];
    if (availableLanguages.hasOwnProperty(primary)) {
      language = primary;
    } else {
      language = 'en-US';
    }
  }
  const links = availableLanguages[language];
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
function getMessageStrict(id, vars = {}) {
  const obj = bundle.getMessage(id, vars);
  if (!obj) {
    console.warn('Missing id', id);
    return null;
  }
  return bundle.formatPattern(obj.value, vars);
}

/**
 * @return {string} Translation of unit or unit's id for debugging purposes
 */
function getMessage(id, vars = {}) {
  return getMessageStrict(id, vars) || `<${id}>`;
}

module.exports = {
  load,
  l10n,
  init,
  getMessage,
  getMessageStrict,
};
