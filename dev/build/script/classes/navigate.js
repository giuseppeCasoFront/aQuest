'use strict';
//- import: axios to get call
import axios from 'axios'

//- import: module methods
import { moduleMethods as moduleMethods } from '../modules/methods'

//- import: helpers
import { CHANGEurl as CHANGEurl } from '../partials/helpers'

//- import: clases
import { classes as classes } from '../classes/classes'
import Transition from '../classes/transition'

export default class Navigate {
	constructor() {
		this._temp = ""
	}

	//- trigger button to move slider
	active(button) {
		if(typeof button !== "undefined" && button !== null) {
			button.addEventListener("click", (e) => {
				e.preventDefault();

				//- get view name
				const target = e.target,
					  href = target.getAttribute("href"),
					  split = href.split('/').pop(),
					  view = split.split('.html')[0]

				//- change view with transition
				let transition = new Transition({'view' : view, 'max' : 4});
				transition.change(this.activeView(this.getHASH()))

				//- change URL path
				this.changeURL(view);
				this._temp = this.getHASH()

				//- pause + mute video
				classes.video.muted()
				classes.video.pause_video()

			}, false)
		}
	}

	//- move view to
	moveToView(view) {
		const active = document.querySelector("#" + view);
		
		//-- view move animation
		if (typeof active !== "undefined" && active !== null) {
			if (active.classList.contains("view--out-right")) {
				active.classList.remove("view--out-right");
				active.classList.add("view--now")
			}
		}
	}

	//- change URL
	changeURL(view) {
		this._temp = this.getHASH();
		const path = window.location.pathname,
			  newPath = path + "#" + view;

		window.history.pushState(view, view, newPath);

		(view !== "start") ? classes.loader.cloneLogoInView(true) : classes.loader.cloneLogoInView(false)
	}

	//- get HASH value
	getHASH() {
		const hash = window.location.hash

		if (hash)
			return window.location.hash.substring(1)
	}

	//- get FILE name
	getFILEname() {
		const url = window.location.pathname

		return url.substring(url.lastIndexOf('/')+1)
	}

	//- set active item
	activeView(obj) {
		return document.querySelector("#" + obj);
	}
}
