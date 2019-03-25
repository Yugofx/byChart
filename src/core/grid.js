import {
	memoise,
	multiply,
	clamp,
	DomBox,
	head,
	pipe,
	reverse,
	widthOf,
	getNumberProp, toArray,
} from '../helpers';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const chartMax = memoise((lines, from, to) => {
	return lines.reduce((acc, line) =>
		Math.max(acc, line.values
		.slice(from, to)
		.reduce((a, b) => Math.max(a, b))), 0);
}, ([lines, from, to]) => lines.reduce((acc, line) => {
	acc += `:${line.id}`;
	return acc;
}, `[${from}..${to}]`));

const relativeToAbsoluteInteger = pipe(multiply, parseInt);
const rangeNormalizer = coefficient =>
	(length, width) => parseInt(length / coefficient * (1 - width));

const fifthNormalizer = rangeNormalizer(20);

const prepareDataForChart = ({data, length, width, left}) => {
	const between = clamp(0, length);
	return [
		data,
		between(relativeToAbsoluteInteger(left, length) - fifthNormalizer(length, width)),
		between(relativeToAbsoluteInteger(left + width, length) + fifthNormalizer(length, width)),
	];
};

export const yValueRangeForNSteps = steps => {
	const getSize = max => {
		let divider = steps;
		while (max / (divider * 10) > 1) {
			divider *= 10;
		}
		return Math.ceil(max / divider) * divider / steps;
	};
	const labels = size => Array.from({ length: steps }, (v, idx) => parseInt(size * (idx + 1)));
	const direction = (() => {
		let max = null;
		return newMax => {
			if (typeof max !== 'number') {
				max = newMax;
				return null;
			}
			if (newMax > max) {
				max = newMax;
				return 1;
			} if (max > newMax) {
				max = newMax;
				return -1;
			}
			return 0;
		}
	})();

	const rangeMax = pipe(prepareDataForChart, data => chartMax(...data));
	const range = pipe(rangeMax, getSize, labels, reverse);
	const max = pipe(range, head);
	const dir = pipe(max, direction);

	return { range, max, rangeMax, dir };
};

export const initY = yGrid => (range, direction) => {
	if (direction === 0) {
		return;
	}
	toArray(yGrid.children).forEach((el, idx, arr) => {
		const wrappedEl = DomBox.of(el);
		if (direction === null) {
			wrappedEl.removeTextNodes().setText(`${range[idx]}`);
			return;
		}
		if (idx === arr.length - 1) {
			return;
		}
		wrappedEl.setAttribute('style', `
			opacity: 0.1;
			height: 20px;
			transform: translateY(${100 * direction}px);
			transition: all 400ms;
		`);
		setTimeout(() => {
			wrappedEl.removeTextNodes().setText(range[idx]).removeAttribute('style')
		}, 400);
	});
};

export const xValueRange = values => xGrid => {
	const viewport = (host =>
			widthOf(host) - getNumberProp('paddingLeft')(host) - getNumberProp('paddingRight')(host)
	)(xGrid.parentNode);
	const maxW = viewport / 0.1;
	const stepWidth = width => width/values.length; // step size in px
	const eachNth = absStep => {
		let divider = 2;
		while ((divider + 1) * absStep < 80) {
			divider += 1;
		}
		return divider;
	};
	const divide = pipe(stepWidth, eachNth);
	
	const format = timestamp => {
		const date = new Date(timestamp);
		return `${months[date.getMonth()]} ${date.getDate()}`;
	};
	const set = step =>
		reverse(values)
			.filter((v, idx) => !(idx % step))
			.map(format);
	const fragment = range => {
		const f = DomBox.fragment();
		range.forEach(val => f.unshiftChildren(DomBox.from('span').setText(`${val}`)));
		return f;
	};
	const content = pipe(set, fragment);
	// init all values

	const animate = (max => {
		DomBox.of(xGrid).pushChildren(content(max));
		const labelRefs = reverse(toArray(xGrid.children));

		return width => {
			const divider = Math.ceil(divide(width) / max);
			labelRefs.forEach((l, idx) => {
				l.classList[idx % divider === 0 ? 'remove' : 'add']('-hide');
			});
		}
	})(divide(maxW));

	return {
		scroll: (x) => {
			xGrid.style.transform = `translateX(${widthOf(xGrid) * x}px)`;
		},
		scale: (x, width) => {
			xGrid.style.width = `${viewport / width}px`;
			const newWidth = widthOf(xGrid);
			animate(newWidth);
			xGrid.style.transform = `translateX(-${newWidth * x}px)`;
		},
	};
};
