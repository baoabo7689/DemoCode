import OpenIdClient from "openid-client";

import initAuth from "./auth";
import initMember from "./member";

const beforeTokenExpired = 60 * 5;
const timeout = 60000;
const { Issuer, custom } = OpenIdClient;

custom.setHttpOptionsDefaults({ timeout });

export default class APIClient {
    constructor(configs, logger) {
        this.configs = configs;
        this.logger = logger;
        this.auth = initAuth(this.configs);
        this.member = initMember(this.configs);
    }

    async autoUpdateToken() {
        const refresh = async () => {
            if (this.isTokenExpired()) {
                await this.updateToken();
            }

            setTimeout(refresh, timeout);
        };

        await this.updateToken();
        setTimeout(refresh, timeout);
    }

    isTokenExpired() {
        return !this.configs.expired || this.configs.expired - Date.now() / 1000 - beforeTokenExpired <= 0;
    }

    async updateToken() {
        try {
            const token = await this.getBearerToken();

            this.configs.token = token.token;
            this.configs.expired = token.expired;

            this.logger.log("Get bearer token successfully.");
        } catch (error) {
            this.logger.logError(`Get bearer token failed: ${error}`);
        }
    }

    async getBearerToken() {
        const clientMetadata = {
            grant_type: "client_credentials",
            client_id: this.configs.client.id,
            client_secret: this.configs.client.secret,
        };
        const issuer = await Issuer.discover(this.configs.authUrl);
        const client = new issuer.Client(clientMetadata);
        const token = await client.grant(clientMetadata);

        return token.access_token
            ? {
                  token: `${token.token_type} ${token.access_token}`,
                  expired: token.expires_at,
              }
            : null;
    }
}
