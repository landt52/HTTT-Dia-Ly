const serve = require('koa-static');
const Router = require('koa-router');
const database = require('./database');


const router = new Router();

router.all("/svg/:type", async(ctx, next) => 
  serve(`${__dirname}/public`)(
    Object.assign(ctx, { path: ctx.params.type + '.svg' }), 
    next)
  );

router.get('/locations/:type', async ctx =>{
    const type = ctx.params.type;
    const results = await database.getLocations(type);
    if (results.length === 0) { ctx.throw(404); }
        const locations = results.map((row) => {
            let geojson = JSON.parse(row.st_asgeojson);
            geojson.properties = { name: row.name, type: row.type, id: row.gid };
            return geojson;
    })
    ctx.body = locations;
});

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

router.get('/locations/:id/summary', async ctx =>{
    const id = ctx.params.id
    const result = await database.getSummary('locations', id)
    ctx.body = result || ctx.throw(404)
});

module.exports = router;