'use strict';

const assert = require('assert').strict;

require('isomorphic-fetch');
const { JWT } = require('@janiscommerce/jwt');

const configValidator = require('./config-validator');
const PKCE = require('./pkce');
const qs = require('../utils/qs');
const {
	AUTHORIZE_ENDPOINT,
	TOKEN_ENDPOINT
} = require('./constants');

module.exports = class Auth {

	constructor(config) {
		configValidator(config);
		this.config = config;
	}

	getAuthorizeUrl(params = {}, baseUrl = AUTHORIZE_ENDPOINT) {

		if(params.code_challenge_method)
			assert(params.code_challenge, 'code_challenge is required if code_challenge_method is provided');

		assert(typeof baseUrl === 'string', 'Token endpoint must be a string');

		const queryParams = qs.buildQueryString({
			response_type: 'code',
			...this.config,
			...params
		});

		return `${baseUrl}${queryParams}`;
	}

	generatePKCEChallenge() {
		return PKCE.generateChallenge();
	}

	async getTokens(authorizationData = {}, baseUrl = TOKEN_ENDPOINT) {

		assert(authorizationData.code, 'Missing authorization code');
		assert(typeof authorizationData.code === 'string', 'Authorization code must be a string');
		assert(authorizationData.codeVerifier, 'Missing PKCE codeVerifier');
		assert(typeof authorizationData.codeVerifier === 'string', 'PKCE codeVerifier must be a string');

		const res = await fetch(baseUrl, {
			method: 'POST',
			body: qs.buildQueryString({
				client_id: this.config.client_id,
				client_secret: this.config.client_secret,
				grant_type: 'authorization_code',
				code: authorizationData.code,
				code_verifier: authorizationData.codeVerifier
			}, false),
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		});

		const responseBody = await res.json();

		if(res.status !== 200)
			throw new Error(`Error ${res.status} - ${responseBody && responseBody.message}`);

		return responseBody;
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

	async refreshTokens(refreshToken, baseUrl = TOKEN_ENDPOINT) {

		assert(refreshToken, 'Missing refresh token');
		assert(typeof refreshToken === 'string', 'Refresh token must be a string');
		assert(typeof baseUrl === 'string', 'Token endpoint must be a string');

		const res = await fetch(baseUrl, {
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

		return responseBody;
	}

};
