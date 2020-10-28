'use strict';

module.exports = class Constants {

	static get AUTHORIZE_ENDPOINT() {
		return 'https://app.janis.in/oauth/authorize';
	}

	static get TOKEN_ENDPOINT() {
		return 'https://id.janis.in/api/oauth/2.0/token';
	}

};
