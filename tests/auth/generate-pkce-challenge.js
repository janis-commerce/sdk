'use strict';

const assert = require('assert').strict;
const sinon = require('sinon');

const { validConfig } = require('../utils');

const { Auth } = require('../../lib');

const PKCE = require('../../lib/auth/pkce');

describe('Auth', () => {
	describe('generatePKCEChallenge()', () => {

		beforeEach(() => sinon.stub(PKCE, 'generateChallenge'));

		afterEach(() => sinon.restore());

		it('Should call the PKCE module and return a rejected promise if it fails', async () => {

			const error = new Error('Failed to generate challenge');

			PKCE.generateChallenge.rejects(error);

			const auth = new Auth(validConfig);
			await assert.rejects(() => auth.generatePKCEChallenge(), error);

			sinon.assert.calledOnceWithExactly(PKCE.generateChallenge);
		});

		it('Should call the PKCE module and return a resolved promise if it does not fail', async () => {

			const expectedChallenge = {
				codeChallengeMethod: 'S256',
				codeChallenge: 'foo',
				codeVerifier: 'bar'
			};

			PKCE.generateChallenge.resolves({ ...expectedChallenge });

			const auth = new Auth(validConfig);
			const challenge = await auth.generatePKCEChallenge();

			assert.deepEqual(challenge, expectedChallenge);

			sinon.assert.calledOnceWithExactly(PKCE.generateChallenge);
		});

	});
});
