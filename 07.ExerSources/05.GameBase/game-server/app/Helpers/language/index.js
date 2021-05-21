const Polyglot = require("node-polyglot");
const initLanguage = require("./language");
const configs = require("./../../../config/appConfigs");

const options = {
  polyglot: Polyglot,
};

const init = (locale) => {
  const isLanguageSupported = configs.supportedLanguages.filter((lang) => lang == locale).length != 0;
  locale = isLanguageSupported ? locale : configs.defaultLanguage;

  return initLanguage({ ...options, locale });
};

module.exports = {  init };
