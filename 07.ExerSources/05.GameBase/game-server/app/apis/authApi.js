const appConfigs = require('./../../config/appConfigs');
const logger = require('./../web/logger').getLogger();

const authApi = {
    isError: (result) => {
        return result.errorCode != 0;
    },
    notifyUser: (result, client) => {
        if (result && client && authApi.isError(result)) {
            client.red({ apiError: { message: `${result.errorMessage} (${result.errorCode})` } })
        }
    },
    notifyLogin: (client, session, data, cb) => {
    },
    verifyToken: async (verifyTokenParams) => {
        try {
            const result = {
                isSuccessful: true,
                clientId: verifyTokenParams.username,
                memberId: verifyTokenParams.userId,
                memberKey: verifyTokenParams.username,
                memberName: verifyTokenParams.username,
                currency: 'UUS',
                language: verifyTokenParams.language || "en-US"
            };

            return result;
        }
        catch (ex) {
            logger.logError(ex);
            return null;
        }
    }
}

module.exports = authApi;