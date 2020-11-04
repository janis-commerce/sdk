'use strict';

const assert = require('assert').strict;
const sinon = require('sinon');

const WordArray = require('crypto-js/lib-typedarrays');

const PKCE = require('../../lib/auth/pkce');

describe('PKCE', () => {
	describe('generateChallenge()', () => {

		const challengeExample = {
			codeChallengeMethod: 'S256',
			codeChallenge: 'k9bqNNyyGHYWCSZb7pcCvA10zw3V8A_dsU_G3vxUm2Y',
			codeVerifier: 'af4920ff9a8f23c28ef0782c58422cf0583917206290a3ebba4d1fb8d1019a1c2c3a6f9a18f873b3c0785e18068e0e4118d9caaf007780d88e0ce9029e059217'
		};

		beforeEach(() => {
			// eslint-disable-next-line max-len
			sinon.stub(WordArray, 'random').returns(challengeExample.codeVerifier);
		});

		afterEach(() => {
			sinon.restore();
		});

		it('Should resolve the challenge props', async () => {

			const challenge = await PKCE.generateChallenge();

			assert.deepEqual(challenge, challengeExample);

			sinon.assert.calledOnceWithExactly(WordArray.random, 64);
		});

	});
});
