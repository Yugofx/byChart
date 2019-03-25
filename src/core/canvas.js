import { clamp, getNumberProp, heightOf, pluck, widthOf, raf } from '../helpers';

const createPath = (size, values) => {
	const path = new Path2D();
	values.forEach((val, idx) => idx === 0 ? path.moveTo(0, val) : path.lineTo(size * idx, val));
	return path;
};
const clearCanvas = canvas => canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

export const canvasWidth = canvas => {
	const absH = heightOf(canvas);
	const relH = canvas.height;
	const viewport = (host =>
		widthOf(host) - getNumberProp('paddingLeft')(host) - getNumberProp('paddingRight')(host)
	)(canvas.parentNode);

	return relativeWidth => {
		const width = relH * (viewport/relativeWidth) / absH;
		canvas.setAttribute('width', width);
		return width;
	};
};

export const moveCanvasX = canvas => {
	return relativeLeft => {
		const x = widthOf(canvas) * relativeLeft;
		canvas.style.transform = `translateX(${x}px)`;
		return x;
	}
};

export const canvasRenderer = (canvas, options) => {
	const ctx = canvas.getContext('2d');
	let prev = null;
	const framer = raf();

	const render = (set, max, length) => {
		Object.keys(options).forEach(key => ctx[key] = options[key]);
		const step = canvas.width / (length - 1);
			pluck('values')(set)
			.map(line => line.map(val => canvas.height - val / max * canvas.height))
			.forEach((val, idx) => {
				ctx.strokeStyle = set[idx].color;
				ctx.stroke(createPath(step, val));
			});
	};

	return (set, max, length) => {
		clearCanvas(canvas);
		framer.stop();
		if (set.length === 0) {
			return;
		}
		if (typeof prev === 'number' && prev !== max) {
			const diff = max - prev;
			const between = clamp(diff > 0 ? prev : max, diff > 0 ? max : prev);
			const animate = () => {
				clearCanvas(canvas);
				prev = between(prev + diff/12);
				render(set, prev, length);
				if (prev !== max) {
					framer.next(animate);
				}
			};
			framer.next(animate);
		} else {
			prev = max;
			render(set, prev, length);
		}
		framer.clear();
	};
};