// import: classes
import Video from '../classes/video'
import Loader from '../classes/loader'
import Views from '../classes/views'
import Navigate from '../classes/navigate'

// import: data source
import player from '../../../assets/configs/player.json'
import pages from '../../../assets/configs/views.json'
import loaders from '../../../assets/configs/loader.json'

let classes = {
	video : new Video(player, ".put__video"),
	loader : new Loader(loaders),
	views : new Views(pages),
	navigate : new Navigate()
}

export { classes}