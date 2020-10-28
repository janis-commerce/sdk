'use strict';

const assert = require('assert').strict;

const { buildQueryString } = require('../../lib/utils/qs');

describe('Utils - qs', () => {
	describe('buildQueryString()', () => {

		it('Should return an empty string if no params are provided', async () => {
			assert.equal(buildQueryString(), '');
			assert.equal(buildQueryString(undefined, false), '');
		});

		it('Should throw if query params are not an object', async () => {
			assert.throws(() => buildQueryString('invalid'), '');
			assert.throws(() => buildQueryString(['invalid']), '');
			assert.throws(() => buildQueryString('invalid', false), '');
			assert.throws(() => buildQueryString(['invalid'], false), '');
		});

		it('Should return an empty string if an empty object is provided as params', async () => {
			assert.equal(buildQueryString({}), '');
			assert.equal(buildQueryString({}, false), '');
		});

		it('Should return the query string with encoded values with prefix by default', async () => {
			assert.equal(buildQueryString({
				foo: 'bar',
				baz: 'test@example.com',
				url: 'https://example.com/test?test=true'
			}), '?foo=bar&baz=test%40example.com&url=https%3A%2F%2Fexample.com%2Ftest%3Ftest%3Dtrue');
		});

		it('Should return the query string with encoded values without prefix if it is passed as false', async () => {
			assert.equal(buildQueryString({
				foo: 'bar',
				baz: 'test@example.com',
				url: 'https://example.com/test?test=true'
			}, false), 'foo=bar&baz=test%40example.com&url=https%3A%2F%2Fexample.com%2Ftest%3Ftest%3Dtrue');
		});

	});
});
