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
		this.locationPointTypes = ['airport', 'hospital']
		this.initializeComponents()
    	this.loadMapData()
	}

	initializeComponents(){
	    this.infoComponent = new InfoPanel('info-panel-placeholder', {
	    	data: {apiService: this.api}
	    })
	    this.mapComponent = new Map('map-placeholder',{
	    	events: {locationSelected: event=>{
	    		const {name, id, type} = event.detail
	    		this.infoComponent.showInfo(name, id, type)
	    	}}
	    })
	}

	async loadMapData(){
		const districtGeojson = await this.api.getDistrictsBoundaries()
		this.mapComponent.addDistrictGeojson(districtGeojson)
		this.mapComponent.toggleLayer('district')

		for(let locationType of this.locationPointTypes){
			const geojson = await this.api.getLocations(locationType)
			this.mapComponent.addLocationGeojson(locationType, geojson, this.getIcon(locationType))
			this.mapComponent.toggleLayer(locationType)
		}
	}

	getIcon(layerName){
	    return `http://localhost:5000/svg/${layerName}`
	}
}

window.ctrl = new ViewController()