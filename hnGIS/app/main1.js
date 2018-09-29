const template = `<div id="app-container">
    				<div id="map-placeholder"></div>
   					<div id="layer-panel-placeholder"></div>
    				<div id="search-panel-placeholder"></div>
    				<div id="info-panel-placeholder"></div>
    			</div>`

import { InfoPanel } from './components/info-panel/info-panel'
import { Map } from './components/map/map'
import { ApiService } from './services/api'

class ViewController{
	constructor(){
		document.getElementById('app').outerHTML = template
		this.initializeComponents()
		this.api = new ApiService('http://localhost:5000/')
		this.initializeComponents()
    	this.loadMapData()
	}

	initializeComponents () {
	    this.infoComponent = new InfoPanel('info-panel-placeholder')
	    this.mapComponent = new Map('map-placeholder')
	}

	async loadMapData(){
		const districtGeojson = await this.api.getCityBoundaries()
		this.mapComponent.addDistrictGeojson(districtGeojson)
		this.mapComponent.toggleLayer('district')
	}
}

window.ctrl = new ViewController()