import { DomBox, reduce } from '../helpers';

const switcher = ({ id, color, name }, fn) =>
	DomBox.from('div').addClasses('switcher')
		.setAttribute('style', `--color: ${color}`)
		.pushChildren(
			DomBox.from('input')
				.setAttribute('type', 'checkbox')
				.setAttribute('value', id)
				.setAttribute('hidden', 'hidden')
				.setAttribute('id', `toggle-${id}`)
				.setAttribute('checked', 'checked')
				.setListener('change', e => fn(id, e.target.checked)),
			DomBox.from('label')
				.addClasses('control')
				.setAttribute('for', `toggle-${id}`)
				.pushChildren(
					DomBox.from('span').addClasses('icon'),
					DomBox.from('span').addClasses('name').setText(name),
				)
		);

const reduceDataForSwitcher = reduce((acc, item) => {
	acc[item.id] = true;
	return acc;
}, {});

export const switchers = (lines, onChange) => {
	let _state = reduceDataForSwitcher(lines);
	onChange(lines);
	return lines.map(line => switcher(line, (id, show) => {
		_state = { ..._state, [id]: show };
		onChange(lines.filter(line => _state[line.id]));
	}));
};