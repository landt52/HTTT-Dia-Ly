import L from 'leaflet'
import { Component } from '../component'

const template = '<div ref="mapContainer" class="map-container"></div>'

export class Map extends Component {
    constructor (mapPlaceholderId, props) {
	    super(mapPlaceholderId, props, template)

	    this.map = L.map(this.refs.mapContainer, {
		    center: [ 21.028511, 105.804817 ],
		    zoom: 10,
		    maxZoom: 20,
		    minZoom: 10
	    })

	    this.map.zoomControl.setPosition('bottomright') 
	    this.layers = {} 
	    this.selectedRegion = null 
    }

    addDistrictGeojson(geojson){
    	this.layers.district = L.geoJSON(geojson, {
    		style: {
    			'color': '#225',
    			'weight': 1,
    			'opacity': 0.65
    		}
    	})
    }

	toggleLayer(layerName){
		const layer = this.layers[layerName]
		if(this.map.hasLayer(layer)){
			this.map.removeLayer(layer)
		}else{
			this.map.addLayer(layer)
		}
	}
}