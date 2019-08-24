const FluentDOM = require('@fluent/dom');
const Fluent = require('@fluent/bundle');

const availableLanguages = {
  'en-US': ['/fluent/en-US/main.ftl'],
  'es-MX': ['/fluent/es-MX/main.ftl'],
};

async function *generateBundles(_resourceIds) {
  // const links = document.querySelectorAll('link[rel="localization"]');
  let language = 'en-US'; // navigator.language;
  let links = availableLanguages[language];
  if (!links) {
    language = 'en-US';
    links = availableLanguages[language];
  }
  const bundle = new Fluent.FluentBundle(language);
  for (const link of links) {
    const res = await fetch(link);
    const text = await res.text();
    bundle.addResource(new Fluent.FluentResource(text));
  }
  window.buns.push(bundle);
  yield bundle;
}

const l10n = new FluentDOM.DOMLocalization([], generateBundles);

function init() {
  l10n.connectRoot(document.documentElement);
  l10n.translateRoots();
}

window.l10n = l10n;
window.buns = [];

module.exports = {
  l10n,
  init,
};
