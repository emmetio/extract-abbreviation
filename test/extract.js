'use strict';

const assert = require('assert');
require('babel-register');
const _extract = require('../index').default;

describe('Extract abbreviation', () => {
	const extract = (abbr, options) => {
		let caretPos = abbr.indexOf('|');
		if (caretPos !== -1) {
			abbr = abbr.slice(0, caretPos) + abbr.slice(caretPos + 1);
		} else {
			caretPos = null;
		}

		return _extract(abbr, caretPos, options);
	};

	const result = (abbreviation, location) => ({abbreviation, location});

	it('basic', () => {
		assert.deepEqual(extract('.bar'), result('.bar', 0));
		assert.deepEqual(extract('.foo .bar'), result('.bar', 5));
		assert.deepEqual(extract('.foo @bar'), result('@bar', 5));
		assert.deepEqual(extract('.foo img/'), result('img/', 5));
		assert.deepEqual(extract('текстdiv'), result('div', 5));
		assert.deepEqual(extract('foo div[foo="текст" bar=текст2]'), result('div[foo="текст" bar=текст2]', 4));
	});

	it('abbreviation with operators', () => {
		assert.deepEqual(extract('a foo+bar.baz'), result('foo+bar.baz', 2));
		assert.deepEqual(extract('a foo>bar+baz*3'), result('foo>bar+baz*3', 2));
	});

	it('abbreviation with attributes', () => {
		assert.deepEqual(extract('a foo[bar|]'), result('foo[bar]', 2));
		assert.deepEqual(extract('a foo[bar="baz" a b]'), result('foo[bar="baz" a b]', 2));
		assert.deepEqual(extract('foo bar[a|] baz'), result('bar[a]', 4));
	});

	it('tag test', () => {
		assert.deepEqual(extract('<foo>bar[a b="c"]>baz'), result('bar[a b="c"]>baz', 5));
		assert.deepEqual(extract('foo>bar'), result('foo>bar', 0));
		assert.deepEqual(extract('<foo>bar'), result('bar', 5));
	});

	it('stylesheet abbreviation', () => {
		assert.deepEqual(extract('foo{bar|}'), result('foo{bar}', 0));
		assert.deepEqual(extract('foo{bar|}', { syntax: 'stylesheet' }), result('bar', 4));
	});
});
