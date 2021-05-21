import Axios from "axios";

const defaultTimeout = 2500; // ms

const sendPostRequest = (action, configs) => async (params, options) => {
    const { apiUrl, token, useAuthenticate, requestTimeout } = configs;
    const requestConfigs = {
        timeout: options?.requestTimeout || requestTimeout || defaultTimeout,
        headers: {},
    };

    if (params?.languageCode) {
        requestConfigs.headers.LanguageCode = params.languageCode;
        delete params.languageCode;
    }

    if (useAuthenticate) {
        requestConfigs.headers.Authorization = token;
    }

    return (await Axios.post(`${apiUrl}${action}`, params, requestConfigs)).data;
};

const createAction = (metadata, configs) =>
    metadata.reduce((result, data) => {
        result[data.name] = sendPostRequest(data.action, configs);

        return result;
    }, {});

export { sendPostRequest, createAction };
