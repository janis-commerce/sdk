'use strict';

const assert = require('assert').strict;

module.exports = config => {

	assert(config, 'APP config is required');
	assert(typeof config === 'object' && !Array.isArray(config), 'APP config must be an object');

	assert(config.client_id, 'Missing APP client_id');
	assert.equal(typeof config.client_id, 'string', 'APP client_id must be a string');

	if(config.client_secret)
		assert.equal(typeof config.client_secret, 'string', 'APP client_secret must be a string');

	assert(config.redirect_uri, 'Missing APP redirect_uri');
	assert.equal(typeof config.redirect_uri, 'string', 'APP redirect_uri must be a string');

	if(config.scope)
		assert.equal(typeof config.scope, 'string', 'APP scope must be a string');
};
