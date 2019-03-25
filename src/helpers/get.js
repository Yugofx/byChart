const stringify = any => {
	return typeof any === 'string' ? any : JSON.stringify(any);
};

export const get = (url, params) => {
	return new Promise((resolve, reject) => {
		let query = params
			? Object.keys(params).map(key => `${key}=${stringify(params[key])}`).join('&')
			: null;
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `${url}${query ? '?' + query : ''}`);
		xhr.onload = () => {
			try {
				resolve(JSON.parse(xhr.response));
			} catch (e) {
				resolve(xhr.response);
			}
		};
		xhr.error = () => {
			try {
				reject(JSON.parse(xhr.response));
			} catch (e) {
				reject(xhr.response);
			}
		};
		xhr.send();
	});
};