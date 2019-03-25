export const raf = () => {
	let frame = null;

	const next = fn => frame = requestAnimationFrame(fn);
	const clear = () => {
		if (frame) {
			frame = null;
		}
	};
	const stop = () => {
		cancelAnimationFrame(frame);
		clear();
	};

	return { next, clear, stop };
};