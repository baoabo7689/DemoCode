const configs = require("./../../../config/appConfigs");
const { loadLanguage } = require("./resources");

module.exports = function (options) {
  const defaultLocale = configs.defaultLanguage;
  let { polyglot, locale } = options;

  locale = locale || defaultLocale;

  let language = new polyglot({
    phrases: loadLanguage(locale),
    locale,
  });

  language.reload = (locale) => {
    locale = locale || defaultLocale;

    language = new polyglot({
      phrases: loadLanguage(locale),
      locale,
    });
  };

  language.keys = Object.keys(language.phrases).reduce((result, key) => {
    result[key] = key;

    return result;
  }, {});

  return language;
};
