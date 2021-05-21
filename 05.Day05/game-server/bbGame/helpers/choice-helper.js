export const configMapping = {
  bigSmall: ["big", "small"] 
};

export const setValueToChoices = (value) => Object.assign({}, ...choices.map((key) => ({ [key]: value })));

export const convertAdminConfigToChoices = (oddConfigs) =>
  Object.assign(
    {},
    ...Object.keys(oddConfigs).flatMap((configKey) => configMapping[configKey].map((key) => ({ [key]: oddConfigs[configKey] })))
  );
