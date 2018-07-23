'use strict';

// import: helpers
import { DOMcreate as DOMcreate } from '../partials/helpers'
import { DOMappend as DOMappend } from '../partials/helpers'
import { TEXTsplit as TEXTsplit } from '../partials/helpers'
import { TEXTtransition as TEXTtransition } from '../partials/helpers'

// import: classes
import { classes as classes } from '../classes/classes'

export default class Loader {
	constructor(args) {
		this._content = document.querySelector(".loader")
		this._perc = 0
		this._min = 330
		this._max = 390
	}

	get perc () {
		return this._perc
	}

	set perc (content) {
		this._perc = content
	}

	mock() {
		const value = document.querySelector(".loader__value__bar");
		value.style.width = this._perc + "%";

		//- mock the perc loaded bar
		if (this._perc !== 100) {
			setTimeout(function() {
				this._perc += 1;
				this.mock()

				this.setPerc()
			}.bind(this), 120)
		}else{
			this.setLoaded()
		}
	}

	setPerc() {
		const path = document.querySelector("#path--loader");

		if (typeof path !== "undefined" && path !== null) {
			const style = window.getComputedStyle(path);

			let value = parseInt(((this._max - this._min) * this._perc) / 100);
			path.style.strokeDasharray = this._min + value;
		}
	}

	setLoaded() {
		const loader = document.querySelector(".loader__value"),
			  bar = loader.querySelector(".loader__value__bar");

		(typeof this._content !== undefined && this._content !== null) ? this._content.classList.add("loader--loaded") : null,
		loader.classList.add("loader__value--loaded");
		this._perc = 0
		bar.style.width = 0;

		bar.addEventListener("transitionend", function() { 
			//- remove bar
			loader.parentNode.removeChild(loader);

			//- clone logo
			classes.loader.cloneLogo();

			//- active button in clone element
			classes.navigate.active(document.querySelector(".loader--cloned.navigate"))
		}, false)
	}

	createLoaderBar() {
		const body = document.querySelector("body"),
			  loader = document.createElement("div"),
			  bar = document.createElement("span");

		loader.classList.add("loader__value")
		bar.classList.add("loader__value__bar")

		loader.appendChild(bar)
		body.appendChild(loader)

		//- start mockup for page loader data
		this.mock()
	}

	cloneLogo() {
		const body = document.querySelector("body"),
			  loader = document.querySelector(".loader");

			  if(typeof loader !== "undefined" && loader !== null) {
				  const clone = loader.cloneNode(true),
				  		naming = clone.querySelector(".loader__naming"),
				  		location = clone.querySelector(".loader__location");

				  naming.parentNode.removeChild(naming);
				  location.parentNode.removeChild(location);

				  clone.classList.add("loader--cloned");

				  clone.setAttribute("href", this.changeHREF())

				  body.appendChild(clone);
				  classes.navigate.active(document.querySelector("#start").querySelector('.navigate'));

				  //- check if view is !== start to append logo
				  classes.navigate.getHASH() !== "start" ? this.cloneLogoInView(true) : null
			}
	}

	//- active in view logo
	cloneLogoInView(status) {
		const logo = document.querySelector(".loader--cloned");
		if (typeof logo !== "undefined" && logo !== null)
			status === true ? logo.classList.add("loader--cloned--active") : logo.classList.remove("loader--cloned--active")
	}

	changeHREF() {
		return classes.views.getPrefix() + "start.html"
	}
}
