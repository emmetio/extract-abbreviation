'use strict';

const code = ch => ch.charCodeAt(0);
const SQUARE_BRACE_L = code('[');
const SQUARE_BRACE_R = code(']');
const ROUND_BRACE_L = code('(');
const ROUND_BRACE_R = code(')');
const CURLY_BRACE_L = code('{');
const CURLY_BRACE_R = code('}');
const SINGLE_QUOTE = code("'");
const DOUBLE_QUOTE = code('"');
const ANGLE_RIGHT = code('>');

const specialChars = new Set('#.*:$-_!@%^+'.split('').map(code));
const bracePairs = new Map()
.set(SQUARE_BRACE_L, SQUARE_BRACE_R)
.set(ROUND_BRACE_L, ROUND_BRACE_R)
.set(CURLY_BRACE_L, CURLY_BRACE_R);

/**
 * Extracts Emmet abbreviation from given string.
 * The goal of this module is to extract abbreviation from current editor’s line,
 * e.g. like this: `<span>.foo[title=bar|]</span>` -> `.foo[title=bar]`, where
 * `|` is a current caret position.
 * @param {String}  line A text line where abbreviation should be expanded
 * @param {Number}  [pos] Caret position in line. If not given, uses end-of-line
 * @param {Boolean} [lookAhead] Allow parser to look ahead of `pos` index for
 * searching of missing abbreviation parts. Most editors automatically inserts
 * closing braces for `[`, `{` and `(`, which will most likely be right after
 * current caret position. So in order to properly expand abbreviation, user
 * must explicitly move caret right after auto-inserted braces. Whith this option
 * enabled, parser will search for closing braces right after `pos`. Default is `true`
 * @return {Object} Object with `abbreviation` and its `location` in given line
 * if abbreviation can be extracted, `null` otherwise
 */
export default function(line, pos, lookAhead) {
	// make sure `pos` is within line range
	pos = Math.min(line.length, Math.max(0, pos == null ? line.length : pos));

	if (lookAhead == null || lookAhead === true) {
		pos = offsetPastAutoClosed(line, pos);
	}

	let c;
	const state = {pos, line, end: pos};
	const stack = [];

	while (state.pos) {
		c = line.charCodeAt(state.pos - 1);

		if (isCloseBrace(c)) {
			stack.push(c)
		} else if (isOpenBrace(c)) {
			if (stack.pop() !== bracePairs.get(c)) {
				// unexpected brace
				break;
			}
		} else if (has(stack, SQUARE_BRACE_R) || has(stack, CURLY_BRACE_R)) {
			// respect all characters inside attribute sets or text nodes
			continue;
		} else if (c === ANGLE_RIGHT ? isHTMLTag(state) : !isAbbreviation(c)) {
			break;
		}

		state.pos--;
	}

	if (!stack.length && state.pos !== state.end) {
		// found something, remove some invalid symbols from the
		// beginning and return abbreviation
		const abbreviation = line.slice(state.pos, state.end).replace(/^[\*\+\>\^]+/, '');
		return {
			abbreviation,
			location: state.end - abbreviation.length
		};
	}
}

/**
 * Returns new `line` index which is right after characters beyound `pos` that
 * edditor will likely automatically close, e.g. }, ], and quotes
 * @param {String} line
 * @param {Number} pos
 * @return {Number}
 */
function offsetPastAutoClosed(line, pos) {
	// closing quote is allowed only as a next character
	if (isQuote(line.charCodeAt(pos))) {
		pos++;
	}

	// offset pointer until non-autoclosed character is found
	while (isCloseBrace(line.charCodeAt(pos))) {
		pos++;
	}

	return pos;
}

function last(arr) {
	return arr[arr.length - 1];
}

function has(arr, value) {
	return arr.indexOf(value) !== -1;
}

function isAbbreviation(c) {
	return (c > 64 && c < 91)   // uppercase letter
		|| (c > 96 && c < 123)  // lowercase letter
		|| (c > 47 && c < 58)   // number
		|| specialChars.has(c); // special character
}

function isOpenBrace(c) {
	return c === SQUARE_BRACE_L || c === ROUND_BRACE_L || c === CURLY_BRACE_L;
}

function isCloseBrace(c) {
	return c === SQUARE_BRACE_R || c === ROUND_BRACE_R || c === CURLY_BRACE_R;
}
