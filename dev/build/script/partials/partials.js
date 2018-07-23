let onLoad = (functions) => {
	window.onload = () => {
		functions()
	}
}

let onReady = (functions) => {
	document.addEventListener("DOMContentLoaded", () => {
		functions();
	});
}

let onResize = (functions) => {
	window.window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	window.window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	let getResize = (e) => {
		let newW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

		newW !== window.window_width || e.type === 'newResize' ? setResize(newW) : null 
	}

	let setResize = (newW) => {
		document.body.classList.add('resizing');
		functions()

		clearTimeout(window.resizeTimer);
		window.resizeTimer = setTimeout(() => {
			document.body.classList.remove('resizing')
		}, 500)

		window.window_width = newW
		window.window_height = window.innerHeight
	}

	document.addEventListener("DOMContentLoaded", () => {
		functions();
	});

	window.addEventListener("resize", getResize, false);
	window.addEventListener("newResize", getResize, false);
}

export { onLoad, onReady, onResize }