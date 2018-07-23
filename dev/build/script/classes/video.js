'use strict';

// import: helpers
import { DOMcreate as DOMcreate } from '../partials/helpers'
import { DOMappend as DOMappend } from '../partials/helpers'
import { EVTmultiple as EVTmultiple } from '../partials/helpers'
import { GETnode as GETnode } from '../partials/helpers'
import { TOGGLEState as TOGGLEState } from '../partials/helpers'
import { SETState as SETState } from '../partials/helpers'

// import: classes
import { classes as classes } from '../classes/classes'

export default class Video {
	constructor(args, location) {
		this._location = location || "body";
		this._id = args.video[0]["id"];
		this._prefix = args.video[0]["prefix"];
		this._srcs = args.video[0]["srcs"];
		this._poster = args.video[0]["poster"] ? "poster = " + args.video[0]["prefix"] + args.video[0]["poster"] : '';
		this._background = args.video[0]["prefix"] + args.video[0]["poster"];
		this._preload = args.video[0]["preload"] ? "preload = " + args.video[0]["preload"] : '';
		this._autoplay = args.video[0]["autoplay"] ? "autoplay" : '';
		this._error = args.video[0]["error"] ? args.video[0]["error"] : '';
		this._payoff = args.video[0]["payoff"] ? args.video[0]["payoff"] : '';
		this._timeline = args.timeline[0]["breackpoints"];
		this._video = '';
		this._handler = '';
		this._progress = '';
		this._handlerMessage = 'Presenta';
	}

	get handler () {
		return this._handler
	}

	set handlerMessage (content) {
		this._handlerMessage = content
	}

	set video(content) {
		this._video = content
	}

	set handler(content) {
		this._handler = content
	}

	set progress(content) {
		this._progress = content
	}

	//- build DOM object
	build() {
		//- create DOM nodes
		this.handler = DOMcreate(`
									<button class = "video__handler" data-state = "pause" data-payoff = "${this._payoff}" data-handlermessage = "${this._handlerMessage}"></button>
								`)

		this.video = DOMcreate( `
									<video
										id = "${this._id}"
										${this._preload}
										${this._poster}
										${this._autoplay}
										muted
										class = "video video--rest" 
									>
										${this._srcs.map((node, i) =>
											`<source
												src = "${this._prefix}${node.name}"
												type = "${node.type}"
											>
											</source>`
										.trim()).join('')}
										<p>${this._error}</p>
									</video>
								`)

		this.append(this._location, this._handler);
		this.append(this._location, this._video);

		this.set_events()
	}

	//- append DOM object node
	append(location, object) {
		//- set wrap
		DOMappend(document.querySelector(location), object);
	}

	//- append time line
	add_timeline() {
		this.progress = DOMcreate(`
									<ul class = "video__progress">
										<li class = "video__progress__bar"></li>
										<li class = "video__load__bar"></li>
										${this._timeline.map((node, i) =>
											`<li id = "${node.id}" class = "${node.link ? "video__breakpoint" : "video__breakpoint video__breakpoint__navigate"}" style = "left: ${this.set_breakpoint(node.time)}%" data-frame = "${node.time}" data-disabled = true>
												<figure class = "video__breakpoint__thumb">
													<img src = "${this._prefix}${node.thumb}" alt = "${node.alt}" />
												</figure>
												<a class = "${node.link ? "video__breakpoint__button navigate" : "video__breakpoint__button"}" href = "${node.link ? node.link : null}" title = "ComingSoon"></a>
												<span class = "video__breakpoint__label">${node.label}</span>
											</li>`
										.trim()).join('')}
									</ul>
								`)

		this.append(this._location, this._progress);

		this._bar_prg = document.querySelector('.video__progress__bar');
		this._bar_ldd = document.querySelector('.video__load__bar');
	}

	//- loaded progress
	update_loaded(buffered, total) {
		return (buffered / total) * 100
	}

	//- reproduction progress
	update_reproduction(current, total) {
		return (current / total) * 100
	}

	//- play video
	play_video() {
		this._video.play();
		this.unmuted();
		SETState(this._handler, "play");
	}

	//- pause video
	pause_video() {
		if (this._video.currentTime > 0) {
			this.set_handlerMessage("continua a guardare");
			this._video.pause();
			this.muted();
			SETState(this._handler, "pause");
		}
	}

	//- audtio on
	unmuted() {
		this._video.muted = false
	}

	//-audio of
	muted() {
		this._video.muted = true
	}

	//- set breakpoint position
	set_breakpoint(time) {
		const duration = parseInt(this._video.duration)
		const position = (time * 100) / duration

		return position
	}

	//- set active breackpoint
	set_active(time) {
		let node = GETnode(this._timeline, "time", time);

		if (node.length != 0) {
			const active = document.getElementById(node[0].id);
			active.removeAttribute("data-disabled");
			(!active.classList.contains('video__breakpoint--first-time')) ? active.classList.add('video__breakpoint--first-time') : null
		}
	}

	//- set intro message
	set_handlerMessage(message) {
		const handler = this.handler
		handler.dataset.handlermessage = this.handlerMessage = message;
	}

	//- goto frame
	set_frame(frame) {
		this._video.currentTime = frame
	}

	//- events
	set_events(){
		//- play/pause
		this._handler.addEventListener("click", (e) => {
			const target = e.target;
			!this._video.paused ? this.pause_video() : this.play_video()
		}, false)

		//- load
		this._video.addEventListener("loadedmetadata", () => {
			this.add_timeline();

			let breakpoints = this._progress.querySelectorAll('.video__breakpoint__navigate');
			for (let breakpoint of breakpoints) {
				//- breakpoint events
				breakpoint.addEventListener('mouseover', () => {
					if (document.querySelector("body").classList.contains("noTouchDevice"))
						(!breakpoint.hasAttribute("data-disabled")) ? this.pause_video() : null;
				}, false)

				breakpoint.addEventListener('mouseout', () => {
					if (document.querySelector("body").classList.contains("noTouchDevice"))
						(!breakpoint.hasAttribute("data-disabled")) ? this.play_video() : null;
				}, false)

				breakpoint.addEventListener('click', () => {
					(!breakpoint.hasAttribute("data-disabled")) ? this.set_frame(breakpoint.dataset.frame) : null
				}, false)
			}

			//- active navigate button when player is ready
			if(classes.navigate.getFILEname() === '')
				classes.navigate.active(this._progress.querySelector('.navigate'))


		}, false)

		//- play progress
		this._video.addEventListener("timeupdate", () => {
			if (typeof this._bar_prg !== "undefined" && this._bar_prg !== null)
				this._bar_prg.style.width = this.update_reproduction(this._video.currentTime, this._video.duration) + "%";
				this.set_active(parseInt(this._video.currentTime))
		}, false)

		//- video end
		this._video.addEventListener('ended', () => {
			this.set_frame(0);
			this.set_handlerMessage("guarda di nuovo")
			TOGGLEState(this._handler, "pause", "play");
		}, false);

		//- fire multiple events
		EVTmultiple(this._video, "progress loadeddata canplaythrough playing", () => {
			if(typeof this._bar_ldd !== "undefined" && this._bar_ldd !== null)
				if(this._video.buffered.length > 0)
					this._bar_ldd.style.width = this.update_loaded(this._video.buffered.end(0), this._video.duration) + "%"
		})
	}

	// get cover
	getPoster() {
		return this._background
	}

	// get prefix
	getPrefix() {
		return this._prefix
	}

}
