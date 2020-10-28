'use strict';

const assert = require('assert').strict;

/**
 * Builds a query string from a key-value object. It allows to add the '?' prefix and escapes the values
 *
 * @param {object|null} queryParams The query parameters as object
 * @param {boolean} [addPrefix=true] Whether to add or not the '?' prefix
 * @return {string} The query string.
 */
module.exports.buildQueryString = (queryParams, addPrefix = true) => {

	if(!queryParams)
		return '';

	assert(typeof queryParams === 'object' && !Array.isArray(queryParams), 'queryParams must be an object');

	if(!Object.keys(queryParams).length)
		return '';

	const prefix = addPrefix ? '?' : '';

	return Object.entries(queryParams)
		.reduce((acum, [name, value], idx) => `${acum}${idx ? '&' : prefix}${name}=${encodeURIComponent(value)}`, '');
};
