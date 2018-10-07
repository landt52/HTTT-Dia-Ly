import { Component } from '../component'
const template = `<div class="search-container">
					  <div class="search-bar">
					    	<input ref="input" type="text" name="search" placeholder="Search..." class="search-input"></input>
					  </div>
					  <div ref="results" class="search-results"></div>
				  </div>`

export class SearchBar extends Component{
	constructor (placeholderId, props) {
	    super(placeholderId, props, template)
	    this.searchService = props.data.searchService
	    this.searchDebounce = null

	    this.refs.input.addEventListener('keyup', (e) => this.onSearch(e.target.value))
	}

	onSearch (value) {
	    clearTimeout(this.searchDebounce)
	    this.searchDebounce = setTimeout(() => this.search(value), 500)
	}

	 search (term) {
	    this.refs.results.innerHTML = ''

	    this.searchResults = this.searchService.search(term).slice(0, 10)

	    this.searchResults.forEach((result) => this.displaySearchResult(result))
	}

	displaySearchResult (searchResult) {
	    let layerItem = document.createElement('div')
	    layerItem.textContent = searchResult.name
	    layerItem.addEventListener('click', () => this.searchResultSelected(searchResult))
	    this.refs.results.appendChild(layerItem)
	}

	searchResultSelected (searchResult) {
	    this.refs.input.value = ''
	    this.refs.results.innerHTML = ''

	    this.triggerEvent('resultSelected', searchResult)
	}
}