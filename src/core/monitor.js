import {
	clamp,
	distinctUntilChanged,
	leftOf,
	pipe,
	each,
	sum,
	toArray,
	widthOf,
} from '../helpers';

const x = e => e.changedTouches[0].pageX;
const subtract = x => y => y - x;
const updateStyle = (el, prop, unit) => val => {
	el.style[prop] = `${val}${unit || ''}`;
	return val;
};
const relativeTo = max => val => val/max;
const onTouchEndOf = el => {
	el.ontouchend = _ => {
		el.ontouchmove = null;
		el.ontouchend = null;
	};
};

export const trackPosition = (area, onDrag) => {
	const max = widthOf(area.parentNode);
	const relativeToMax = relativeTo(max);
	area.ontouchstart = e => {
		e.stopPropagation();
		const pos = { start: x(e), absLeft: leftOf(area) };
		area.ontouchmove = pipe(
			x,
			subtract(pos.start),
			sum(pos.absLeft),
			clamp(0, max - widthOf(area)),
			distinctUntilChanged,
			updateStyle(area, 'left', 'px'),
			relativeToMax,
			onDrag
		);
		onTouchEndOf(area);
	};
	return area;
};

export const trackResize = (area, onResize) => {
	const max = widthOf(area.parentNode);
	const relativeToMax = relativeTo(max);
	const min = max * 0.1;

	onResize([relativeToMax(widthOf(area)), relativeToMax(leftOf(area))]);

	toArray(area.children).forEach((side, idx) => {
		const view = side.parentNode;
		side.ontouchstart = e => {
			e.stopPropagation();
			const start = {
				xPos: x(e),
				left: leftOf(view),
				width: widthOf(view),
			};
			if (idx === 0) {
				side.ontouchmove = pipe(
					x,
					subtract(start.xPos),
					sum(start.left),
					clamp(0, start.left + start.width - min),
					distinctUntilChanged,
					updateStyle(view, 'left', 'px'),
					(updatedLeft) => start.width - (updatedLeft - start.left),
					clamp(min, max),
					updateStyle(view, 'width', 'px'),
					each(relativeToMax, () => relativeToMax(leftOf(view))),
					onResize,
				);
			} else {
				side.ontouchmove = pipe(
					x,
					subtract(start.xPos),
					sum(start.width),
					clamp(min, max - start.left),
					distinctUntilChanged,
					updateStyle(view, 'width', 'px'),
					each(relativeToMax, () => relativeToMax(start.left)),
					onResize
				);
			}
			onTouchEndOf(side);
		};
	});
	return area;
};