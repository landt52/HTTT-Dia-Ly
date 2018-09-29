import {Component} from '../component'
const template = `<div ref="container" class="info-container">
                      <div ref="title" class="info-title">
                          <h1>Nothing Selected</h1>
                      </div>
                      <div class="info-body">
                          <div class="info-content-container">
                              <div ref="content" class="info-content"></div>
                              </div>
                          </div>
                  </div>`

export class InfoPanel extends Component{
    constructor (placeholderId, props){
        super(placeholderId, props, template)

        this.refs.title.addEventListener('click', () => this.refs.container.classList.toggle('info-active'))
    }
}