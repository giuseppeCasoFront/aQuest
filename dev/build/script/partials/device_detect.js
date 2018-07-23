var body,
	is_touch_device;

let detectTouchDevice = {
	detect : () => {
		body = document.body;

		is_touch_device = 'ontouchstart' in document.documentElement;

		is_touch_device === true ? body.classList.add('touchDevice') : body.classList.add('noTouchDevice');

		detectTouchDevice.mouseStart();
		detectTouchDevice.touchStart();
	},

	removeTouchClass: () => {
		if (body.classList.contains('noTouchDevice') === false) {
			body.classList.add('noTouchDevice');
			body.classList.remove('touchDevice');
		}

	},

	addTouchClass: () => {
		if (body.classList.contains('touchDevice') === false) {
			body.classList.add('touchDevice');
			body.classList.remove('noTouchDevice');
		}

	},

	mouseStart: function() {

		body.preventMouseMove = false;

		body.addEventListener('touchstart', (e) => {
			return body.preventMouseMove = true;
		});

		body.addEventListener('mousemove', (e) => {
			if (body.preventMouseMove === false) {
				detectTouchDevice.removeTouchClass();
			}
		});

		body.addEventListener('click', (e) => {
			body.preventMouseMove = false;
		});

	},

	touchStart: function() {

		body.addEventListener('touchstart', () =>{
			detectTouchDevice.addTouchClass();
		});

	}
}

export { detectTouchDevice }
