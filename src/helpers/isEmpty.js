export const isEmpty = any => {
	if (typeof any === 'string' && !any) {
		return true;
	}
	if (Array.isArray(any) && any.length === 0) {
		return true;
	}
	if (Object.prototype.toString.call(any) === '[object Object]' && Object.keys(any).length === 0) {
		return true;
	}
	return false;
};