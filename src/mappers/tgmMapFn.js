import { tail, head } from '../helpers';

export const tgmMapFn = (data, idx) => {
	return Object.keys(data.types).reduce((acc, key) => {
		if (!acc.hasOwnProperty('title')) {
			acc.title = `Chart #${idx + 1}`;
		}
		if (data.types[key] === 'x') {
			acc.x = {
				id: `${key}_${idx}`,
				values: tail(data.columns.find(col => head(col) === key)),
			};
		} else {
			if (!acc.hasOwnProperty(data.types[key])) {
				acc[data.types[key]] = [];
			}
			acc[data.types[key]].push({
				id: `${key}_${idx}`,
				color: data.colors[key] || null,
				name: data.names[key] || null,
				values: tail(data.columns.find(col => head(col) === key))
			});
		}
		return acc;
	}, {})};