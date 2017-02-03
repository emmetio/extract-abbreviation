'use strict';

/**
 * Quotes-related utilities
 */

const SINGLE_QUOTE = 39; // '
const DOUBLE_QUOTE = 34; // "
const ESCAPE       = 92; // \

/**
 * Check if given character code is a quote
 * @param  {Number}  c
 * @return {Boolean}
 */
export function isQuote(c) {
	return c === SINGLE_QUOTE || c === DOUBLE_QUOTE;
}

/**
 * Consumes quoted value, if possible
 * @param  {StreamReader} stream
 * @return {Boolean}      Returns `true` is value was consumed
 */
export function eatQuoted(stream) {
	const start = stream.pos;
	const quote = stream.prev();

	if (isQuote(quote)) {
		while (!stream.sol()) {
			if (stream.prev() === quote && stream.peek() !== ESCAPE) {
				return true;
			}
		}
	}

	stream.pos = start;
	return false;
}
