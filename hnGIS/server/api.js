const Router = require('koa-router');
const database = require('./database');

const router = new Router();

router.get('/hanoi', async ctx =>{
  	const results = await database.getCityBoundaries();
 	if (results.length === 0) { ctx.throw(404); }
  	const boundaries = results.map((row) => {
    	let geojson = JSON.parse(row.st_asgeojson);
    	geojson.properties = { name: row.name_2, id: row.gid };
    	return geojson;
 	})
  	ctx.body = boundaries;
});

router.get('/hanoi/:id/size', async ctx =>{
	const id = ctx.params.id;
	const result = await database.getDistrictSize(id);
	if(!result) { console.log(result); }
	const districtSize = (result.size*10000);
	ctx.body = districtSize;
});

module.exports = router;