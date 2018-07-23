//- import: partials
import { onLoad as onLoad } from './partials/partials'
import { onReady as onReady } from './partials/partials'
import { onResize as onResize } from './partials/partials'

import { detectTouchDevice as detectTouchDevice } from './partials/device_detect'

//- import: clases
import { classes as classes } from './classes/classes'

//- evt: load
let onLoadFunctions = () => {
	classes.views.initLoader();

	if (classes.navigate.getFILEname() === "") {
		classes.loader.createLoaderBar()
		typeof classes.navigate.getHASH() === "undefined" ? classes.navigate.changeURL("start") : null
	}

	detectTouchDevice.detect()
}

onLoad(onLoadFunctions)

//- evt: ready
let onReadyFunctions = () => {}

onReady(onReadyFunctions)

//- evt: resize
let onResizeFunctions = () => {}

onResize(onResizeFunctions)