'use strict';

const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');
const WordArray = require('crypto-js/lib-typedarrays');

const codeChallengeMethod = 'S256';

const getRandomVerifier = () => {
	return WordArray.random(64).toString();
};

module.exports = class PKCE {

	static generateChallenge() {

		const codeVerifier = getRandomVerifier();

		const hashed = sha256(codeVerifier);

		const codeChallenge = base64.stringify(hashed)
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

		return {
			codeChallengeMethod,
			codeChallenge,
			codeVerifier: codeVerifier.toString()
		};
	}

};
