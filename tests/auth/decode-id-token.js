'use strict';

const assert = require('assert').strict;
const sinon = require('sinon');

const { JWT } = require('@janiscommerce/jwt');

const { validConfig } = require('../utils');

const { Auth } = require('../../lib');

describe('Auth', () => {
	describe('decodeIdToken()', () => {

		beforeEach(() => {
			sinon.stub(JWT.prototype, 'verifyToken');
		});

		afterEach(() => {
			sinon.restore();
		});

		it('Should reject if no idToken is provided', async () => {
			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.decodeIdToken());
		});

		it('Should reject if idToken is not a string', async () => {
			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.decodeIdToken(['invalid id token']));
		});

		it('Should reject if jwksUri is provided and it is not a string', async () => {
			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.decodeIdToken('the-id-token', ['invalid jwksUri']));
		});

		it('Should reject if the token fails to be decoded', async () => {

			const error = new Error('Failed to decode token');

			JWT.prototype.verifyToken.rejects(error);

			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.decodeIdToken('the-id-token'));

			sinon.assert.calledOnceWithExactly(JWT.prototype.verifyToken, 'the-id-token');
		});

		it('Should resolve the decoded token if no errors occur', async () => {

			const tokenClaims = {
				sub: '3424324324',
				name: 'John Doe',
				exp: '1603908068'
			};

			JWT.prototype.verifyToken.resolves({ ...tokenClaims });

			const auth = new Auth(validConfig);
			const decodedToken = await auth.decodeIdToken('the-id-token');

			assert.deepEqual(decodedToken, tokenClaims);

			sinon.assert.calledOnceWithExactly(JWT.prototype.verifyToken, 'the-id-token');
		});

	});
});
