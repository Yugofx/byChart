export class DomBox {
	static of(el) {
		return new DomBox(el);
	}

	static for(selector) {
		return DomBox.fromNullable(document.querySelector(selector));
	}

	static from(tag) {
		return new DomBox(document.createElement(tag));
	}

	static fragment() {
		return new DomBox(document.createDocumentFragment());
	}

	static right(el) {
		return new DomBoxRight(el);
	}

	static left(el) {
		return new DomBoxLeft(el);
	}

	static fromNullable(el) {
		return el === null ? DomBox.left(el) : DomBox.right(el);
	}

	constructor(el) {
		this._element = el;
	}

	get element() {
		return this._element;
	}

	// Basic functor
	map(f) {
		return DomBox.of(f(this._element));
	}

	// Applied functors
	addClasses(...classes) {
		return this.map(el => {
			for (let cl of classes) {
				if (typeof cl === 'string') {
					cl.split(' ').forEach(clazz => el.classList.add(clazz));
				}
			}
			return el;
		});
	}

	removeClasses(...classes) {
		return this.map(el => {
			for (let cl of classes) {
				if (typeof cl === 'string') {
					cl.split(' ').forEach(clazz => el.classList.remove(clazz));
				}
			}
			return el;
		})
	}

	pushChildren(...children) {
		return this.map(el => {
			for (let child of children) {
				if (child) {
					if (typeof child === 'string') {
						el.appendChild(document.createTextNode(child));
					} else if (child instanceof DomBox) {
						el.appendChild(child.element);
					} else {
						el.appendChild(child);
					}
				}
			}
			return el;
		});
	}

	unshiftChildren(...children) {
		return this.map(el => {
			for (let child of children.reverse()) {
				if (child) {
					if (typeof child === 'string') {
						el.insertBefore(document.createTextNode(child), el.firstChild);
					} else if (child instanceof DomBox) {
						el.insertBefore(child.element, el.firstChild);
					} else {
						el.insertBefore(child, el.firstChild);
					}
				}
			}
			return el;
		});
	}

	removeChild(child) {
		return this.map(el => {
			if (child) {
				if (child instanceof DomBox) {
					el.removeChild(child.element);
				} else {
					el.removeChild(child);
				}
			}
			return el;
		});
	}

	setAttribute(name, value) {
		return this.map(el => {
			el.setAttribute(name, value);
			return el;
		});
	}

	removeAttribute(name) {
		return this.map(el => {
			el.removeAttribute(name);
			return el;
		});
	}

	removeAttributes(...attrs) {
		return this.map(el => {
			if (attrs.length) {
				for (let attr of attrs) {
					el.removeAttribute(attr);
				}
			}
			return el;
		});
	}

	forEach(fn) {
		return this.map(el => {
			[...el.children].forEach(fn);
			return el;
		});
	}

	switchToChild(selector) {
		const el = this._element.querySelector(selector);
		return DomBox.fromNullable(el);
	}

	switchToParent(selector) {
		return DomBox.fromNullable(this._element.closest(selector));
	}

	setText(string) {
		return this.map(el => {
			if (string) {
				el.appendChild(document.createTextNode(string));
			}
			return el;
		});
	}

	removeTextNodes() {
		return this.map(el => {
			for (let i = 0, child; !!(child = el.childNodes[i]); i++) {
				if (child.nodeType === document.TEXT_NODE) {
					el.removeChild(child);
				}
			}
			return el;
		});
	}

	setListener(event, cb) {
		return this.map(el => {
			el.addEventListener(event, cb);
			return el;
		});
	}

	insertIn(parent) {
		return this.map(el => {
			if (parent instanceof DomBox) {
				parent.element.appendChild(el);
			} else {
				parent.appendChild(el);
			}
			return el;
		});
	}

	hasClass(token) {
		return this.element.classList.contains(token);
	}

	chain(f) {
		return f(this._element);
	}
}

class DomBoxRight extends DomBox {}

class DomBoxLeft extends DomBox {
	get element() {
		throw new ReferenceError('Cannot extract element from DomBuilderLeft(element)');
	}

	map(_) {
		return this;
	}

	chain(_) {
		return null;
	}
}