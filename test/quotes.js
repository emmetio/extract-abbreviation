'use strict';

const assert = require('assert');
require('babel-register');
const StreamReader = require('../lib/stream-reader').default;
const eat = require('../lib/quotes').eatQuoted;

describe('Quotes', () => {
	const stream = str => new StreamReader(str);

	it('eat quoted string backwards', () => {
		let s = stream(' "foo"');
		assert(eat(s));
		assert.equal(s.pos, 1);

		s = stream('"foo"');
		assert(eat(s));
		assert.equal(s.pos, 0);

		s = stream('""');
		assert(eat(s));
		assert.equal(s.pos, 0);

		s = stream('"a\\\"b"');
		assert(eat(s));
		assert.equal(s.pos, 0);

		// don’t eat anything
		s = stream('foo');
		assert(!eat(s));
		assert.equal(s.pos, 3);
	});
});
