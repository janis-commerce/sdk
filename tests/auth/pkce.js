'use strict';

const assert = require('assert').strict;
const sinon = require('sinon');

const WordArray = require('crypto-js/lib-typedarrays');

const PKCE = require('../../lib/auth/pkce');

describe('PKCE', () => {
	describe('generateChallenge()', () => {

		const challengeExample = {
			codeChallengeMethod: 'S256',
			codeChallenge: 'SF0-z92Hap94Ql0mki9de_pPiewkRHgI816jUFmyW9A',
			codeVerifier: 'dce416529fc91f536e47f5341ed52200c4728873191b12fc0926d75582d561e1bd61628afbb9ac8202aaf384419385667db25fefcfa9272c3e12b1a9e6fb3afc'
		};

		beforeEach(() => {
			// eslint-disable-next-line max-len
			sinon.stub(WordArray, 'random').returns(challengeExample.codeVerifier);
		});

		afterEach(() => {
			sinon.restore();
		});

		it('Should resolve the challenge props', () => {

			const challenge = PKCE.generateChallenge();

			assert.deepEqual(challenge, challengeExample);

			sinon.assert.calledOnceWithExactly(WordArray.random, 64);
		});

	});
});
