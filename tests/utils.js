'use strict';

module.exports.validConfig = {
	client_id: '6da51295-bc34-4ac8-baad-7cf634ea7137',
	client_secret: '3ce6c5ec780528e9ee720e65b08d4ae8537a4d59c1ac151124d017a79c9bc754',
	redirect_uri: 'https://joaco.app/oauth/callback',
	scope: 'openid profile email offline_access'
};

module.exports.tokensData = {
	token_type: 'Bearer',
	expires_in: 172799,
	scope: 'openid profile email offline_access',
	access_token: 'the-access-token',
	id_token: 'the-id-token',
	refresh_token: 'the-refresh-token'
};

module.exports.deleteProp = (object, prop) => {
	const { [prop]: propToRemove, ...newObject } = object;
	return newObject;
};
