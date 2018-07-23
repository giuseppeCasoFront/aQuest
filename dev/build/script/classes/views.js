'use strict';
//- import: axios to get call
import axios from 'axios'

//- import: module methods
import { moduleMethods as moduleMethods } from '../modules/methods'

//- import: helpers
import { DOMcreate as DOMcreate } from '../partials/helpers'
import { DOMappend as DOMappend } from '../partials/helpers'
import { CHANGEurl as CHANGEurl } from '../partials/helpers'

// import: classes
import { classes as classes } from '../classes/classes'

export default class Views {
	constructor(args) {
		this._list = args['views'];
		this._prefix = "../output/views/";
		this._view = ''
		this._index = 0
	}

	set view (content) {
		this._view = content
	}

	get prefix () {
		return this._prefix
	}

	//- call to get a html view
	loadViews(args) {
		axios.get(args["file"], {}).then(res => {
			const data = res.data,
				  location = document.querySelector("#views") || document.querySelector("#main");

			//- check view location
			const html = DOMcreate(`<li class = "view view--out-right" id = "${args["id"]}">${this.setTempWrap(data).querySelector(".view__display").outerHTML}</li>`)
			location.id === "views" ? this.appendView(location, html) : null

			//- call dynamic methods if exists
			if (typeof args["method"] !== "undefined" && args["method"] !== null) {
				for (let method of args["method"])
					moduleMethods[args["method"]]()
			}

			//- load next page
			args["index"] !== (this._list.length-1) ? this.initLoader() : null
		})
	}

	updateProgress(evt) {
		if (evt.lengthComputable)
			var percentComplete = evt.loaded / evt.total * 100;
	}

	//- create a temp DOM object
	setTempWrap(data) {
		return DOMcreate(`<div>${data}</div>`)
	}

	//- append VIEW to DOM
	appendView(location, object) {
		//- set wrap
		DOMappend(location, object);

		//- active navigation button
		if(classes.navigate.getFILEname() === '')
			classes.navigate.active(object.querySelector('.navigate'))

		//- get to view if hash value !== empty
		typeof classes.navigate.getHASH() !== "undefined" && classes.navigate.getHASH() !== null ? classes.navigate.moveToView(classes.navigate.getHASH()) : null
	}

	initLoader() {
		//- set arguments for page load
		let args =  {
			"index" : this._index,
			"file" : this._prefix + this._list[this._index]['file'],
			"id" : this._list[this._index]['id'],
			"method" : this._list[this._index]['fn']
		}

		this._index =+ 1;
		this.loadViews(args)
	}

	getPrefix() {
		return this._prefix
	}
}
