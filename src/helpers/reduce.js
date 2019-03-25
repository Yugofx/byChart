export const reduce = (fn, initial) => arr => initial
	? arr.reduce((a, b) => fn(a, b), initial)
	: arr.reduce((a, b) => fn(a, b));