export const getProp = (prop, fn) => el =>
	(styles => fn ? fn(styles[prop]) : styles[prop])(getComputedStyle(el));
export const getNumberProp = prop => el => getProp(prop, parseFloat)(el);

export const leftOf = getNumberProp('left');
export const widthOf = getNumberProp('width');
export const heightOf = getNumberProp('height');