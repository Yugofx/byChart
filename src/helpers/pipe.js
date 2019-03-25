import { tail, head } from './';

export const pipe = (...fns) => (...args) =>
	tail(fns).reduce((acc, fn, idx, arr) => {
		try {
			return fn(acc);
		} catch (e) {
			arr.splice(idx);
			return acc;
		}
	}, head(fns)(...args));
