import {Component} from '../component'
const template = `<div ref="container" class="info-container">
                      <div ref="title" class="info-title">
                          <h1>Nothing Selected</h1>
                      </div>
                      <div class="info-body">
                          <div class="info-content-container">
                              <div ref="content" class="info-content"></div>
                              <input type="color" id="color" name="color" value="#ff0000">
                          </div>
                      </div>
                  </div>`

export class InfoPanel extends Component{
    constructor (placeholderId, props){
        super(placeholderId, props, template)
        this.api = props.data.apiService

        this.refs.title.addEventListener('click', () => this.refs.container.classList.toggle('info-active'))
    }

    async showInfo(name, id){
        this.refs.title.innerHTML = `<h1>${name}</h1>`
        this.refs.content.innerHTML = await this.getDistrictDetails(id)
    }

    async getDistrictDetails(id){
        let districtSize = await this.api.getAllDistrictDetails(id)
        districtSize=districtSize.districtSize.toFixed(2)
        return `<h3>Quận/Huyện</h3>
                <div>Kích thước - khoảng ${districtSize} km<sup>2</sup></div>
                `
    }
}