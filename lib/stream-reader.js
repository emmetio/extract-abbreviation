'use strict';

/**
 * Minimalistic backwards stream reader
 */
export default class StreamReader {
	constructor(string) {
		this.string = string;
		this.pos = this.string.length;
	}

	sol() {
		return this.pos === 0;
	}

	peek(offset) {
		return this.string.charCodeAt(this.pos - 1 + (offset || 0));
	}

	prev() {
		if (!this.sol()) {
			return this.string.charCodeAt(--this.pos);
		}
	}

	eat(match) {
		const ok = typeof match === 'function'
			? match(this.peek())
			: match === this.peek();

		if (ok) {
			this.pos--;
		}

		return ok;
	}

	eatWhile(match) {
		const start = this.pos;
		while (this.eat(match)) {}
		return this.pos < start;
	}
}
