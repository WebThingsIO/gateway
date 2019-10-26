const API = require('./api');
const FluentDOM = require('@fluent/dom/compat');
const Fluent = require('@fluent/bundle/compat');

const availableLanguages = {
  'en-US': ['/fluent/en-US/main.ftl'],
  en: ['/fluent/en-US/main.ftl'],
  it: ['/fluent/it/main.ftl'],
};

let language;
let englishBundle;
let bundle;

async function load() {
  let response = {};
  try {
    response = await API.getLanguage();
  } catch (_) {
    // keep going
  }

  language = response.current || navigator.language || 'en-US';
  if (!availableLanguages.hasOwnProperty(language)) {
    const primary = language.split('-')[0];
    if (availableLanguages.hasOwnProperty(primary)) {
      language = primary;
    } else {
      language = 'en-US';
    }
  }

  if (language !== response.current) {
    // don't bother waiting for this, it's not super important
    API.setLanguage(language).catch(() => {});
  }

  const links = availableLanguages[language];
  bundle = new Fluent.FluentBundle(language);
  for (const link of links) {
    try {
      const res = await fetch(link);
      const text = await res.text();
      bundle.addResource(new Fluent.FluentResource(text));
    } catch (e) {
      console.warn('Unable to download language pack:', e);
    }
  }

  if (language === 'en-US') {
    englishBundle = bundle;
  } else {
    const englishLinks = availableLanguages['en-US'];
    englishBundle = new Fluent.FluentBundle('en-US');
    for (const link of englishLinks) {
      try {
        const res = await fetch(link);
        const text = await res.text();
        englishBundle.addResource(new Fluent.FluentResource(text));
      } catch (e) {
        console.warn('Unable to download English language pack:', e);
      }
    }
  }
}

async function *generateBundles(_resourceIds) {
  if (!bundle) {
    await load();
  }
  yield *[bundle, englishBundle];
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
  if (!bundle) {
    console.warn('Bundle not yet loaded');
    return null;
  }

  const obj = bundle.getMessage(id, vars);
  if (!obj) {
    console.warn('Missing id', id);
    return null;
  }
  return bundle.formatPattern(obj.value, vars);
}

/**
 * @return {string|null} Translation of unit or null if not contained in bundle
 */
function getEnglishMessageStrict(id, vars = {}) {
  if (!englishBundle) {
    console.warn('Bundle not yet loaded');
    return null;
  }

  const obj = englishBundle.getMessage(id, vars);
  if (!obj) {
    console.warn('Missing id', id);
    return null;
  }
  return englishBundle.formatPattern(obj.value, vars);
}

/**
 * @return {string} Translation of unit or unit's id for debugging purposes
 */
function getMessage(id, vars = {}) {
  let msg = getMessageStrict(id, vars);
  if (msg) {
    return msg;
  }

  msg = getEnglishMessageStrict(id, vars);
  if (msg) {
    return msg;
  }

  return `<${id}>`;
}

/**
 * @return {string} The user's chosen language.
 */
function getLanguage() {
  return language;
}

module.exports = {
  load,
  l10n,
  init,
  getMessage,
  getMessageStrict,
  getLanguage,
};
