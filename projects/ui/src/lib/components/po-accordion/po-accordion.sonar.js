const AppController = require('../../../entities/apps/apps-controller');
const ClientController = require('../../../entities/clients/clients-controller');
const SetController = require('../../../entities/sets/sets-controller');
const { StatusCodes } = require('http-status-codes');
const appController = new AppController();
const clientController = new ClientController();
const setController = new SetController();

const ERROR_MESSAGES = {
    APP_NOT_FOUND: 'App not found',
    CLIENT_NOT_FOUND: 'Client not found',
    SET_NOT_FOUND: 'Set not found',
    EMPTY_HEADERS: 'Empty or invalid headers!',
    INVALID_ALIAS: 'Invalid Alias',
    NO_ACTIVE_HOSTS: 'No active hosts for this set',
    INVALID_OIDC: 'Invalid host authentication type. Expected "protheus_oidc".',
    INVALID_TOKEN_OIDC: 'Invalid token for the App',
    TOKEN_REQUIRED: 'Authorization token is required'
};

class OIDCAuthenticationController {

    async getAuthForOIDC(headers, token) {
        this.validateHeaders(headers);

        await this.validateTokenForApp(token);

        const arrAlias = headers['x-oidc-alias'].split(' ');
        const prefix = arrAlias[0];
        const suffix = arrAlias.length === 2 ? arrAlias[1] : '';

        const credentials = {
            prefix,
            suffix,
            appId: headers['x-oidc-app-id'],
            headers
        };

        return await this.validateAndReturnOidc(credentials, headers, token);
    }

    validateHeaders(headers) {
        if (!headers['x-oidc-alias'] || !headers['x-oidc-app-id']) {
            throw new Error(ERROR_MESSAGES.EMPTY_HEADERS);
        }

        const arrAlias = headers['x-oidc-alias'].split(' ');
        if (arrAlias.length !== 1 && arrAlias.length !== 2) {
            console.warn(`OIDC Authentication: ${ERROR_MESSAGES.INVALID_ALIAS} ${arrAlias}`);
            throw new Error(ERROR_MESSAGES.INVALID_ALIAS);
        }
    }

    async validateTokenForApp(token) {
        if (!token) {
            throw new Error(ERROR_MESSAGES.TOKEN_REQUIRED);
        }

        const formattedToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const app = await appController.validateAppToken(formattedToken);
        if (!app) {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN_OIDC);
            /* c8 ignore start */
        }
        return app;
    }

    /* c8 ignore stop */
    async validateAndReturnOidc(credentials, headers, token) {
        try {
            const app = await appController.findActiveById(credentials.appId);
            if (!app) {
                throw new Error(ERROR_MESSAGES.APP_NOT_FOUND);
            }
            console.info(`OIDC Auth: App found: ${app.name}`);

            const client = await clientController.findActiveClientByPrefix(credentials.prefix);
            if (!client) {
                throw new Error(ERROR_MESSAGES.CLIENT_NOT_FOUND);
            }

            const set = await setController.findActiveSetBySuffixWithHost(app._id, client._id, credentials.suffix);
            if (!set) {
                throw new Error(ERROR_MESSAGES.SET_NOT_FOUND);
            }

            if (!set._host) {
                throw new Error(ERROR_MESSAGES.NO_ACTIVE_HOSTS);
            }

            if (set._host.authType !== 'protheus_oidc') {
                throw new Error(ERROR_MESSAGES.INVALID_OIDC);
            }

            return {
                status: StatusCodes.OK,
                clientId: client._id,
                setId: set._id,
                appId: app._id,
                deviceId: headers['x-oidc-device-id'],
                authType: set._host.authType,
                clientName: client.name,
                setAlias: set.alias_suffix
            };

        } catch (error) {
            console.error(`Error in OIDC Host Validation: ${error.message}`, error);
            throw error;
        }
    }
}

module.exports = OIDCAuthenticationController;