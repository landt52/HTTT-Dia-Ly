import Fuse from 'fuse.js'

export class SearchService{
	constructor(){
	    this.options = {
		    keys: ['name'],
		    shouldSort: true,
		    threshold: 0.3,
		    location: 0,
		    distance: 100,
		    maxPatternLength: 32,
		    minMatchCharLength: 1
	    }

	    this.searchbase = []
	    this.fuse = new Fuse([], this.options)
	}

	addGeoJsonItems(geojson, layerName){
	    this.searchbase = this.searchbase.concat(geojson.map(item=>{
	      	return {layerName, name: item.properties.name, id: item.properties.id}
	    }))

	    this.fuse = new Fuse(this.searchbase, this.options)
	}

	search(term){
	    return this.fuse.search(term)
	}
}