export class Component{
    constructor(placeholderId, props={}, template){
        this.componentElem = document.getElementById(placeholderId)

        if (template){
            this.componentElem.innerHTML = template;
            this.refs = {}
            const refElems = this.componentElem.querySelectorAll('[ref]')
            refElems.forEach((elem)=>{ this.refs[elem.getAttribute('ref')] = elem })
        }
        if(props.events){ this.createEvents(props.events) }
    }

    createEvents(events){
        Object.keys(events).forEach((eventName)=>{
            this.componentElem.addEventListener(eventName, events[eventName], false)
        })
    }

    triggerEvent(eventName, detail){
        const event = new window.CustomEvent(eventName, { detail })
        this.componentElem.dispatchEvent(event)
    }
}