import {get} from 'axios'

export class ApiService{
	constructor(url = 'http://localhost:5000/'){
		this.url = url;
	}

	async httpGet(endpoint = ''){
		const response = await get(`${this.url}${endpoint}`)
		return response.data
	}

	getDistrictsBoundaries(){
		return this.httpGet(`hanoi`)
	}

	getDistrictSize(id){
		return this.httpGet(`hanoi/${id}/size`)
	}

	async getAllDistrictDetails(id){
		return{
			districtSize: await this.getDistrictSize(id)
		}
	}
}