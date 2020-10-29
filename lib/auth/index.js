'use strict';

const assert = require('assert').strict;

require('isomorphic-fetch');
const { JWT } = require('@janiscommerce/jwt');

const configValidator = require('./config-validator');
const PKCE = require('./pkce');
const qs = require('../utils/qs');
const { parseTokensData } = require('../utils/token-data-parser');
const {
	AUTHORIZE_ENDPOINT,
	TOKEN_ENDPOINT
} = require('./constants');

module.exports = class Auth {

	constructor(config) {
		configValidator(config);
		this.config = config;
	}

	getAuthorizeUrl(params = {}, authorizeEndpoint = AUTHORIZE_ENDPOINT) {

		if(params.code_challenge_method)
			assert(params.code_challenge, 'code_challenge is required if code_challenge_method is provided');

		assert(typeof authorizeEndpoint === 'string', 'Token endpoint must be a string');

		const queryParams = qs.buildQueryString({
			response_type: 'code',
			...this.config,
			...params
		});

		return `${authorizeEndpoint}${queryParams}`;
	}

	generatePKCEChallenge() {
		return PKCE.generateChallenge();
	}

	async getTokens(authorizationData = {}, tokenEndpoint = TOKEN_ENDPOINT) {

		assert(authorizationData.code, 'Missing authorization code');
		assert(typeof authorizationData.code === 'string', 'Authorization code must be a string');

		if(authorizationData.codeVerifier)
			assert(typeof authorizationData.codeVerifier === 'string', 'PKCE codeVerifier must be a string');

		const res = await fetch(tokenEndpoint, {
			method: 'POST',
			body: qs.buildQueryString({
				client_id: this.config.client_id,
				client_secret: this.config.client_secret,
				grant_type: 'authorization_code',
				code: authorizationData.code,
				...(authorizationData.codeVerifier ? { code_verifier: authorizationData.codeVerifier } : {})
			}, false),
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		});

		const responseBody = await res.json();

		if(res.status !== 200)
			throw new Error(`Error ${res.status} - ${responseBody && responseBody.message}`);

		return parseTokensData(responseBody);
	}

	async decodeIdToken(idToken, jwksUri = null) {

		assert(idToken, 'Missing idToken');
		assert(typeof idToken === 'string', 'idToken must be a string');

		if(jwksUri)
			assert(typeof jwksUri === 'string', 'jwksUri must be a string');

		const jwt = new JWT({
			jwksUri
		});

		const decodedToken = await jwt.verifyToken(idToken);

		return decodedToken;
	}

	async refreshTokens(refreshToken, tokenEndpoint = TOKEN_ENDPOINT) {

		assert(refreshToken, 'Missing refresh token');
		assert(typeof refreshToken === 'string', 'Refresh token must be a string');
		assert(typeof tokenEndpoint === 'string', 'Token endpoint must be a string');

		const res = await fetch(tokenEndpoint, {
			method: 'POST',
			body: qs.buildQueryString({
				client_id: this.config.client_id,
				client_secret: this.config.client_secret,
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			}, false),
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		});

		const responseBody = await res.json();

		if(res.status !== 200)
			throw new Error(`Error ${res.status} - ${responseBody && responseBody.message}`);

		return parseTokensData(responseBody);
	}

};
