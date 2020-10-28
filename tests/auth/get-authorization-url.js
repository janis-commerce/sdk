'use strict';

const assert = require('assert').strict;

const { validConfig } = require('../utils');

const { Auth } = require('../../lib');

describe('Auth', () => {
	describe('getAuthorizeUrl()', () => {

		it('Should throw if code_challenge_method is provided but code_challenge is not', () => {
			const auth = new Auth(validConfig);
			assert.throws(() => auth.getAuthorizeUrl({
				code_challenge_method: 'S256'
			}));
		});

		it('Should throw if custom base endpoint is provided and it is not a string', () => {
			const auth = new Auth(validConfig);
			assert.throws(() => auth.getAuthorizeUrl({}, ['invalid authorizeUrl']));
		});

		it('Should return the authorize URL without PCKE if not params are provided', () => {
			const auth = new Auth(validConfig);
			const authorizeUrl = auth.getAuthorizeUrl();

			// eslint-disable-next-line max-len
			assert.equal(authorizeUrl, 'https://app.janis.in/oauth/authorize?response_type=code&client_id=6da51295-bc34-4ac8-baad-7cf634ea7137&client_secret=3ce6c5ec780528e9ee720e65b08d4ae8537a4d59c1ac151124d017a79c9bc754&redirect_uri=https%3A%2F%2Fjoaco.app%2Foauth%2Fcallback&scope=openid%20profile%20email%20offline_access');
		});

		it('Should return the authorize URL with PCKE if challenge is provided', () => {
			const auth = new Auth(validConfig);
			const authorizeUrl = auth.getAuthorizeUrl({
				code_challenge: 'asdasdasd',
				code_challenge_method: 'S256'
			});

			// eslint-disable-next-line max-len
			assert.equal(authorizeUrl, 'https://app.janis.in/oauth/authorize?response_type=code&client_id=6da51295-bc34-4ac8-baad-7cf634ea7137&client_secret=3ce6c5ec780528e9ee720e65b08d4ae8537a4d59c1ac151124d017a79c9bc754&redirect_uri=https%3A%2F%2Fjoaco.app%2Foauth%2Fcallback&scope=openid%20profile%20email%20offline_access&code_challenge=asdasdasd&code_challenge_method=S256');
		});

		it('Should return the authorize URL with a custom base endpoint if it is provided', () => {

			const auth = new Auth(validConfig);
			const authorizeUrl = auth.getAuthorizeUrl({}, 'https://example.com/authorize');

			// eslint-disable-next-line max-len
			assert.equal(authorizeUrl, 'https://example.com/authorize?response_type=code&client_id=6da51295-bc34-4ac8-baad-7cf634ea7137&client_secret=3ce6c5ec780528e9ee720e65b08d4ae8537a4d59c1ac151124d017a79c9bc754&redirect_uri=https%3A%2F%2Fjoaco.app%2Foauth%2Fcallback&scope=openid%20profile%20email%20offline_access');
		});

	});
});
