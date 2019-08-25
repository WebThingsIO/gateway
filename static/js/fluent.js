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
    const res = await fetch(link);
    const text = await res.text();
    bundle.addResource(new Fluent.FluentResource(text));
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

function getMessage(id) {
  const obj = bundle.getMessage(id);
  if (!obj) {
    console.warn('Missing id', id);
    return `<${id}>`;
  }
  return obj.value;
}

module.exports = {
  load,
  l10n,
  init,
  getMessage,
};
