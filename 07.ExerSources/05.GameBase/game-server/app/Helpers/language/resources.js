const loadLanguage = (language) => {
  return require(`../../../data/languages/${language}.json`);
};

module.exports = {  loadLanguage };
