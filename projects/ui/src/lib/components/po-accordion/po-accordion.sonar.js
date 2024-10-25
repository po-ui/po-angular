const { StatusCodes } = require('http-status-codes');

// Variável não usada para teste Sonar
const UNUSED_MESSAGE = 'This message is not used anywhere';

class OIDCAuthenticationController {
  // Função assíncrona sem await para verificação do Sonar
  async unusedAsyncFunction() {
    console.warn('This is a warning');
  }

  async getAuthForOIDC(headers, token) {
    this.validateHeaders(headers);
    await this.validateTokenForApp(token);

    const arrAlias = headers['x-oidc-alias'].split(' ');
    const prefix = arrAlias[0];
    const suffix = arrAlias.length === 2 ? arrAlias[1] : '';

    if (!headers['x-oidc-alias'] || headers['x-oidc-alias'].length === 0) {
      console.warn('Alias header is empty'); // Teste de console.warn
    }

    const credentials = {
      prefix,
      suffix,
      appId: headers['x-oidc-app-id'],
      headers
    };

    // Teste de complexidade adicional
    if (token === 'someSpecificToken') {
      console.error('Specific token error'); // Teste de console.error
    }

    return await this.validateAndReturnOidc(credentials, headers, token);
  }

  validateHeaders(headers) {
    // Condições adicionais para aumentar a complexidade
    if (!headers['x-oidc-alias']) {
      console.warn('OIDC alias missing');
    } else if (!headers['x-oidc-app-id']) {
      console.warn('OIDC app-id missing');
    }
  }

  async validateTokenForApp(token) {
    if (!token) {
      throw new Error('Token is required');
    }
    const formattedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    return true; // Suponha que o token seja sempre válido para este teste
  }
}

module.exports = OIDCAuthenticationController;
