import { capitalise, nextIdx, DomBox } from '../helpers';

export const theme = themes => {
	if (themes.length < 2) {
		console.error(`Cannot theme the app with only ${themes.length} theme. Need at least 2`);
	}
	return DomBox
		.for('.page-footer button')
		.setListener('click', createOnThemeChangeListener(themes));
};

const createOnThemeChangeListener = themes => {
	let active = 0;
	return e => {
		active = nextIdx(themes, active);
		DomBox.of(e.target)
			.removeTextNodes()
			.setText(`Switch to ${capitalise(themes[nextIdx(themes, active)])} Mode`);
		DomBox.for('html').setAttribute('theme', themes[active]);
	};
};