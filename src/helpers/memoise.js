export const memoise = (fn, hashFn) => {
	const cache = new Map();
	return (...args) => {
		const key = hashFn ? hashFn(args) : JSON.stringify(args);
		if (!cache.has(key)) {
			cache.set(key, fn.call(null, ...args));
		}
		return cache.get(key);
	}
};