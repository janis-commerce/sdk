# sdk

[![Build Status](https://github.com/janis-commerce/sdk/workflows/Build%20Status/badge.svg)](https://github.com/janis-commerce/sdk/actions?query=workflow%3A%22Build+Status%22)
[![Coverage Status](https://github.com/janis-commerce/sdk/workflows/Coverage%20Status/badge.svg)](https://github.com/janis-commerce/sdk/actions?query=workflow%3A%22Coverage+Status%22)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Fsdk.svg)](https://www.npmjs.com/package/@janiscommerce/sdk)

An SDK to interact with Janis easily

## Installation

```sh
npm install @janiscommerce/sdk
```

## API

### Auth

This SDK implements the OAuth Authorization Code flow + PKCE, which is the recommended flow for Web and Native APPs.

You can see this module API in the following examples:

#### Authorization Request

```js
const { Auth } = require('@janiscommerce/sdk');

const options = {
	client_id: 'YOUR_APP_CLIENT_ID', // Required
	client_secret: 'YOUR_APP_CLIENT_SECRET', // Not required yet
	redirect_uri: 'YOUR_APP_REDIRECT_URI', // Required
	scope: 'scope to authorize', // Recommended
	state: 'optional app state'
};

const authClient = new Auth(options);

const {
	codeVerifier,
	codeChallenge,
	codeChallengeMethod
} = await authClient.generatePKCEChallenge();

// Store safely to fetch the tokens later
storeSafely(pkceChallenge.codeVerifier);

const authorizeUrl = authClient.getAuthorizeUrl({
	code_challenge: codeChallenge,
	code_challenge_method: codeChallengeMethod
});

window.location.href = authorizeUrl;
```

#### Tokens Fetching and Refreshing

```js
const { Auth } = require('@janiscommerce/sdk');

const options = {
	client_id: 'YOUR_APP_CLIENT_ID', // Required
	client_secret: 'YOUR_APP_CLIENT_SECRET', // Required for fetching and refreshing tokens
	redirect_uri: 'YOUR_APP_REDIRECT_URI' // Required
};

const authClient = new Auth(options);

// Retrieve the verifier from your storage
const codeVerifier = fetchCodeVerifierFromSafeStorage();

const [, authorizationCode] = window.location.search.match(/[?&]code=([^?&]+)/) || [];

const {
	tokenType,
	expiresIn,
	scope,
	accessToken,
	idToken, // This is only returned if openid scope is authorized
	refreshToken // This is only returned if offline_access scope is authorized
} = await authClient.getTokens({
	code: authorizationCode
	codeVerifier: codeVerifier
});

const userData = await authClient.decodeIdToken(id_token);

console.log(`Hello ${userData.name}!`);

// refreshTokens() response has the same structure than getTokens()
const newTokens = await authClient.refreshTokens(refresh_tokens);
```

The `Auth` by default uses Janis Production endpoints. But if you need to test against the QA environment, or even if you want to use it against a custom Authorization server (for example, Google's), you can pass an extra argument to each method:

- `getAuthorizeUrl(appInfo, 'https://accounts.google.com/o/oauth2/v2/auth')`
- `getTokens(authorizationData, 'https://oauth2.googleapis.com/token')`
- `decodeIdToken(idToken, 'https://www.googleapis.com/oauth2/v3/certs')`
- `refreshTokens(refreshTokens, 'https://oauth2.googleapis.com/token')`
