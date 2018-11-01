import L from 'leaflet'
import '../../../node_modules/leaflet/dist/Leaflet.PolylineMeasure.js'
import '../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.min.js'
import '../../../node_modules/leaflet-control-geocoder-1.6.0/dist/Control.Geocoder.js'
import { Component } from '../component'

const template = '<div ref="mapContainer" class="map-container"></div>'

export class Map extends Component {
    constructor(mapPlaceholderId, props){
	    super(mapPlaceholderId, props, template)

	    this.map = L.map(this.refs.mapContainer, {
		    center: [ 21.028511, 105.804817 ],
		    zoom: 10,
		    maxZoom: 20,
		    minZoom: 6,
		    layers: [
	        			new L.TileLayer(
	            			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	           				{
	               		 		attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
	            			}
	        			)
    				]
	    })
	    L.control.polylineMeasure({position:'topleft', unit:'metres', showBearings:true, clearMeasurementsOnStop: false, showClearControl: true, showUnitControl: true}).addTo(this.map)
        L.Control.geocoder().addTo(this.map);
        L.Routing.control({
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim(),
            router: L.Routing.mapbox('pk.eyJ1IjoibGFuZHQ1MiIsImEiOiJjam1yajJ1OHAwMWg4M3RvYmVoZDdmc21sIn0.M2RTMfWf_QFThhS7Q4ESnA')
        }).addTo(this.map)
	    this.map.zoomControl.setPosition('topleft') 
	    this.layers = {} 
	    this.selectedRegion = null 
    }

    addLocationGeojson(layerTitle, geojson, iconUrl){
        this.layers[layerTitle] = L.geoJSON(geojson, {
            pointToLayer: (feature, latlng) =>{
                return L.marker(latlng, {
                    icon: L.icon({ iconUrl, iconSize: [40, 80] }),
                    title: feature.properties.name })
            },
            onEachFeature: this.onEachLocation.bind(this)
        })
    }

    onEachLocation(feature, layer){
        layer.bindPopup(feature.properties.name, {closeButton: false})
        layer.on({click: (e)=>{
            const {name, id, type} = feature.properties
            this.triggerEvent('locationSelected', { name, id, type })
        }})
    }

    addDistrictGeojson(geojson){
    	this.layers.district = L.geoJSON(geojson, {
    		style: {
    			'color': '#225',
    			'weight': 1,
    			'opacity': 0.65
    		},
    		onEachFeature: this.onEachDistrict.bind(this)
    	})
    }

    onEachDistrict(feature, layer){
    	layer.on({click: (e)=>{
    		const {name, id} = feature.properties
    		this.map.closePopup()
    		// this.setHighlightedRegion(layer)
    		this.triggerEvent('locationSelected', {name, id, type: 'district'})   
            this.changeColor(layer)
    	}})
    }

    // setHighlightedRegion(layer){
    // 	if(this.selected){
    // 		this.layers.district.resetStyle(this.selected)
    // 	}
    // 	this.selected = layer
    // 	if(this.selected){
    // 		this.selected.bringToFront()
    //         this.selected.setStyle({ color: 'blue' })
    // 	}
    // }

    changeColor(layer){
        var colorButton = document.getElementById('colorButton')
        var color = document.getElementById('color')
            layer.setStyle({color: color.value})
    }

	toggleLayer(layerName){
		const layer = this.layers[layerName]
		if(this.map.hasLayer(layer)){
			this.map.removeLayer(layer)
		}else{
			this.map.addLayer(layer)
		}
	}

    selectLocation(id, layerName){
        const geojsonLayer = this.layers[layerName]
        const sublayers = geojsonLayer.getLayers()
        const selectedSublayer = sublayers.find(layer => {
            return layer.feature.geometry.properties.id === id
        })

        if (selectedSublayer.feature.geometry.type === 'Point') {
            this.map.flyTo(selectedSublayer.getLatLng(), 15)
        } else {
            this.map.flyToBounds(selectedSublayer.getBounds(), 10)
        }

        selectedSublayer.fireEvent('click')
    }
}