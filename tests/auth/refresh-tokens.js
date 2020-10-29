'use strict';

const assert = require('assert').strict;
const sinon = require('sinon');

const { validConfig, tokensData, tokensDataParsed } = require('../utils');

const { Auth } = require('../../lib');

describe('Auth', () => {
	describe('refreshTokens()', () => {

		const originalFetch = fetch;

		beforeEach(() => {
			global.fetch = sinon.stub();
		});

		afterEach(() => {
			sinon.restore();
			global.fetch = originalFetch;
		});

		it('Should reject if no refreshToken is provided', async () => {
			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.refreshTokens());
		});

		it('Should reject if refreshToken is not a string', async () => {
			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.refreshTokens(['invalid refresh token']));
		});

		it('Should reject if token url is provided and it is not a string', async () => {
			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.refreshTokens('the-refresh-token', ['invalid token url']));
		});

		it('Should reject if fetch fails', async () => {

			const error = new Error('Fetch error');

			global.fetch.rejects(error);

			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.refreshTokens('the-refresh-token'), error);

			sinon.assert.calledOnce(global.fetch);
		});

		it('Should reject if fetch JSON parse fails', async () => {

			const error = new Error('Fetch error');
			const json = sinon.fake.rejects(error);

			global.fetch.resolves({
				status: 400,
				json
			});

			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.refreshTokens('the-refresh-token'), error);

			sinon.assert.calledOnce(global.fetch);
			sinon.assert.calledOnceWithExactly(json);
		});

		it('Should reject if HTTP status is not 200 OK', async () => {

			const json = sinon.fake.resolves({ message: 'Some error' });

			global.fetch.resolves({
				status: 400,
				json
			});

			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.refreshTokens('the-refresh-token'), new Error('Error 400 - Some error'));

			sinon.assert.calledOnce(global.fetch);
			sinon.assert.calledOnceWithExactly(json);
		});

		it('Should resolve the tokens data if no errors occur', async () => {

			const json = sinon.fake.resolves({ ...tokensData });

			global.fetch.resolves({
				status: 200,
				json
			});

			const auth = new Auth(validConfig);
			const tokens = await auth.refreshTokens('the-refresh-token');

			assert.deepEqual(tokens, tokensDataParsed);

			sinon.assert.calledOnceWithExactly(global.fetch, 'https://id.janis.in/api/oauth/2.0/token', {
				method: 'POST',
				// eslint-disable-next-line max-len
				body: 'client_id=6da51295-bc34-4ac8-baad-7cf634ea7137&client_secret=3ce6c5ec780528e9ee720e65b08d4ae8537a4d59c1ac151124d017a79c9bc754&grant_type=refresh_token&refresh_token=the-refresh-token',
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				}
			});

			sinon.assert.calledOnce(global.fetch);
			sinon.assert.calledOnceWithExactly(json);
		});

		it('Should use a custom token url if it is provided', async () => {

			const json = sinon.fake.resolves({ ...tokensData });

			global.fetch.resolves({
				status: 200,
				json
			});

			const auth = new Auth(validConfig);
			const tokens = await auth.refreshTokens('the-refresh-token', 'https://example.com/token');

			assert.deepEqual(tokens, tokensDataParsed);

			sinon.assert.calledOnceWithExactly(global.fetch, 'https://example.com/token', {
				method: 'POST',
				// eslint-disable-next-line max-len
				body: 'client_id=6da51295-bc34-4ac8-baad-7cf634ea7137&client_secret=3ce6c5ec780528e9ee720e65b08d4ae8537a4d59c1ac151124d017a79c9bc754&grant_type=refresh_token&refresh_token=the-refresh-token',
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				}
			});

			sinon.assert.calledOnce(global.fetch);
			sinon.assert.calledOnceWithExactly(json);
		});

	});
});
