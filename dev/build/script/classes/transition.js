'use strict';

//- import: helpers
import { DOMcreate as DOMcreate } from '../partials/helpers'
import { DOMappend as DOMappend } from '../partials/helpers'

//- import: helpers
import { CHANGEurl as CHANGEurl } from '../partials/helpers'

// import: classes
import { classes as classes } from '../classes/classes'

export default class Transition {
	constructor(args) {
		this._view = args['view'];
		this._max = args['max'];
		this._block = '';
		this._window = window.innerWidth;
		this._ended = []
	}

	get view() {
		return this._view
	}

	get max() {
		return this._max
	}

	get block() {
		return this._block
	}

	set block(content) {
		this._block = content
	}

	get window() {
		return this._window
	}

	get ended() {
		return this._ended
	}

	//- change highlight view
	change(active) {
		var now = active || document.querySelector(".view--now")
		const classes = ['view--active', 'view--out-left', 'view--now'];
		now.classList.add(...classes)

		now.addEventListener("animationend", function() {
			this.classList.remove(...classes)
			this.classList.add("view--out-right")
		}, false)

		this.create()
	}

	//- create modular blocks
	create() {	
		this.block = DOMcreate( `
									<ul class = "transition">
										${Array(this.max).join(0).split(0).map((item, i) =>`
											<li class = "transition__overflow transition__overflow--in" style = "width: calc(100% / ${this.max}); right: ${((this.window / this.max) * (this.max - (i + 1)))}px;">${this.getViewDOM(this.view, i)}</li>
										`).join('')}
										
									</ul>
								` )

		// delete video from transition block
		// to replace it with poster
		const players = this.block.querySelectorAll("#player")
		if (players.length > 0) {
			for(let player of players)
				player.parentNode.removeChild(player)
		}

		this.append("body", this.block);
		this.comingIn()
	}

	//- append DOM object node
	append(location, object) {
		//- set wrap
		DOMappend(document.querySelector(location), object);
	}

	//- create a temp DOM object
	setTempWrap(data, width, position) {
		const background = this.view === "video" ? `background-image : url(${classes.video.getPoster()})` : '';
		return DOMcreate(`
							<div>
								<div class = "transition__stripe" style = "width: ${width}px; left: ${position}px; ${background}">
									${data}
								</div>
							</div>
						`)
	}

	//- get transitioned view
	getViewDOM(obj, index) {
		const view = document.querySelector("#" + obj),
			  toWidth = view.offsetWidth,
			  toLeft = ((this.window / this.max) * index) * -1;

		return this.setTempWrap(view.innerHTML, toWidth, toLeft).innerHTML;
	}

	//- enter view
	comingIn() {
		const stripes = document.querySelectorAll('.transition__overflow'); 

		for (let stripe of stripes) {
			stripe.classList.remove('transition__overflow--in')

			stripe.addEventListener("animationend", (e) => {
				this._ended.push(e.target) 

				if(this.ended.length === this.max){
					this._block.parentNode.removeChild(this._block);
					this.view !== "start" ? classes.navigate.moveToView(this.view) : classes.navigate.moveToView("start")
				}

			}, false)
		}
	}
}
