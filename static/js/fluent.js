const FluentDOM = require('fluent-dom');
const Fluent = require('fluent');

const availableLanguages = {
  'en-US': ['/fluent/en-US/main.ftl'],
  'es-MX': ['/fluent/es-MX/main.ftl'],
};

async function *generateBundles(_resourceIds) {
  // const links = document.querySelectorAll('link[rel="localization"]');
  let language = 'es-MX'; // navigator.language;
  let links = availableLanguages[language];
  if (!links) {
    language = 'en-US';
    links = availableLanguages[language];
  }
  const bundle = new Fluent.FluentBundle(language);
  for (const link of links) {
    const res = await fetch(link);
    const text = await res.text();
    bundle.addResource(Fluent.FluentResource.fromString(text));
  }
  yield bundle;
}

const l10n = new FluentDOM.DOMLocalization([], generateBundles);

function init() {
  l10n.connectRoot(document.documentElement);
  l10n.translateRoots();
}

module.exports = {
  l10n,
  init,
};
