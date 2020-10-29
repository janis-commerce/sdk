'use strict';

module.exports.parseTokensData = tokensData => {

	const {
		token_type: tokenType,
		expires_in: expiresIn,
		scope,
		access_token: accessToken,
		id_token: idToken,
		refresh_token: refreshToken
	} = tokensData;

	return {
		tokenType,
		expiresIn,
		scope,
		accessToken,
		...(idToken ? { idToken } : {}),
		...(refreshToken ? { refreshToken } : {})
	};

};
