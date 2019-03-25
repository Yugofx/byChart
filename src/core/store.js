import { isEmpty } from '../helpers';

export const store = () => {
	let listeners = { all: [] };
	let state = {};
	let prev = null;
	const addUnregisteredAction = action => {
		if (!listeners[action]) {
			listeners[action] = [];
		}
	};

	return {
		next: (updates, action) => {
			if (isEmpty(updates)) {
				return;
			}
			prev = state;
			state = { ...prev, ...updates };
			if (!action) {
				return;
			}
			addUnregisteredAction(action);
			[action, 'all'].forEach(a => listeners[a].forEach(listener => listener(prev, state)));
		},
		subscribe: (action, listener, emitOnSubscribe) => {
			if (typeof action === 'string') {
				if (action === '*') {
					listeners.all.push(listener);
				} else {
					addUnregisteredAction(action);
					listeners[action].push(listener);
				}
			} else {
				action.forEach(action => {
					addUnregisteredAction(action);
					listeners[action].push(listener);
				});
			}
			if (emitOnSubscribe) {
				listener(null, state);
			}
		},
	}
};