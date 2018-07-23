//- build html nodes
const DOMcreate = (string) => {
	let html = new DOMParser().parseFromString( string, 'text/html' );
	return html.body.childNodes[0]
}

//- append to
const DOMappend = (where, node) => {
	where.appendChild(node)
}

//- split text
const TEXTsplit = (string) => {
	const str = string.split(",")
	return str
}


//- split text
const TEXTtransition = {
	args: {},
	index : 0,

	getNode : function() {
		const wrap = document.querySelector(this.args["wrap"]);
		let node = wrap.children[this.index];

		this.setActive(node)
	},

	setActive : function(e) {
		const wrap = document.querySelector(this.args["wrap"]);
		const nodes = wrap.children;

		e.classList.add(this.args["active"])

		setTimeout( () => {
			e.classList.remove(this.args["active"]);
			(this.index === (this.args["limit"] - 1)) ? this.index = 0 : this.index = this.index + 1;
			this.getNode()
		}, this.args["delay"]);
	}
}

//- multiple event listener
const EVTmultiple = (el, listeners, fn) => {
	listeners.split(' ').forEach(e => el.addEventListener(e, fn, false))
}

//- find in object by attribute value
const GETnode = (obj, attr, value) => {
	return obj.filter((node) => node[attr] === value)
}

//- toggle state
const TOGGLEState = (obj, stateOne, stateTwo) => {
  obj.dataset.state = obj.dataset.state === stateOne ? stateTwo : stateOne
};

//- toggle state
const SETState = (obj, state) => {
  obj.dataset.state = state
};

//- change URL
const CHANGEurl = (file) => {
	const path = window.location.pathname,
		  newPath = path + file;

	window.history.pushState("", "", newPath)
}

export { DOMcreate,  DOMappend, TEXTsplit, TEXTtransition, EVTmultiple, GETnode, TOGGLEState, SETState, CHANGEurl }