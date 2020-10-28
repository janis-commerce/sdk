'use strict';

const assert = require('assert').strict;

const { validConfig, deleteProp } = require('../utils');

const { Auth } = require('../../lib');

describe('Auth', () => {
	describe('validations', () => {

		it('Should fail if config is not provided', () => {
			assert.throws(() => new Auth());
		});

		it('Should fail if config is not an object', () => {
			assert.throws(() => new Auth(false));
			assert.throws(() => new Auth(null));
			assert.throws(() => new Auth('hi'));
			assert.throws(() => new Auth(['hi']));
		});

		it('Should fail if client_id is not provided', () => {
			assert.throws(() => new Auth(deleteProp(validConfig, 'client_id')));
		});

		it('Should fail if client_id is not a string', () => {
			assert.throws(() => new Auth({
				...validConfig,
				client_id: ['invalid']
			}));
		});

		it('Should fail if client_secret is not a string', () => {
			assert.throws(() => new Auth({
				...validConfig,
				client_secret: ['invalid']
			}));
		});

		it('Should fail if redirect_uri is not provided', () => {
			assert.throws(() => new Auth(deleteProp(validConfig, 'redirect_uri')));
		});

		it('Should fail if redirect_uri is not a string', () => {
			assert.throws(() => new Auth({
				...validConfig,
				redirect_uri: ['invalid']
			}));
		});

		it('Should fail if scope is not a string', () => {
			assert.throws(() => new Auth({
				...validConfig,
				scope: ['invalid']
			}));
		});

		it('Should pass with minimal config', () => {
			assert.doesNotThrow(() => new Auth({
				client_id: validConfig.client_id,
				redirect_uri: validConfig.redirect_uri
			}));
		});

		it('Should pass with full config', () => {
			assert.doesNotThrow(() => new Auth(validConfig));
		});

	});
});
