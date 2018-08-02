const request = require('request-promise-native');

class AuthenticationModel {
  constructor(params) {
    this.secret = params.secret;
    this.apiEndPoint = params.apiEndPoint;
  }

  get accessToken() {
    return this.response.access_token;
  }

  async readRequest() {
    try {
      const response = await request({
        method: 'POST',
        url: `${this.apiEndPoint}/v2/auth/token`,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          authorization: `Basic ${this.secret}`,
        },
        form: {
          grant_type: 'client_credentials',
        },
      });

      this.response = JSON.parse(response);
    } catch (error) {
      console.log(`Authentication response error ${error.statusCode}`);
      console.log(JSON.parse(error.error));
    }
  }
}

module.exports = AuthenticationModel;
