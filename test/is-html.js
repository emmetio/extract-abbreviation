'use strict';

const assert = require('assert');
require('babel-register');
const StreamReader = require('../lib/stream-reader').default;
const isAtHTMLTag = require('../lib/is-html').default;

describe('HTML test', () => {
	const test = str => isAtHTMLTag(new StreamReader(str));

	it('simple tag', () => {
		assert(test('<div>'));
		assert(test('<div/>'));
		assert(test('<div />'));
		assert(test('</div>'));
	});

	it('tag with attributes', () => {
		assert(test('<div foo="bar">'));
		assert(test('<div foo=bar>'));
		assert(test('<div foo>'));
		assert(test('<div a="b" c=d>'));
		assert(test('<div a=b c=d>'));
		assert(test('<div a=^b$ c=d>'));
		assert(test('<div a=b c=^%d]$>'));
		assert(test('<div title=привет>'));
		assert(test('<div title=привет123>'));
		assert(test('<foo-bar>'));
	});
	
	it('invalid tags', () => {
		assert(!test('div>'));
		assert(!test('<div'));
		assert(!test('<div привет>'));
		assert(!test('<div =bar>'));
		assert(!test('<div foo=>'));
		assert(!test('[a=b c=d]>'));
		assert(!test('div[a=b c=d]>'));
		assert(!test('diva=b asd=as asd>'));
	});
});
