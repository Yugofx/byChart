export const distinctUntilChanged = (() => {
	let _prev;
	const distinctUntilChanged = val => {
		if (_prev !== val) {
			_prev = val;
			return val;
		} else {
			throw 'Same value';
		}
	};
	return distinctUntilChanged;
})();