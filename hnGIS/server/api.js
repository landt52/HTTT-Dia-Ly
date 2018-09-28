const Router = require('koa-router');
const database = require('./database');
// const cache = require('./cache');
const joi = require('joi');
const validate = require('koa-joi-validate');

const router = new Router();

router.get('/hanoi', async ctx => {
  const results = await database.getCityBoundaries();
  if (results.length === 0) { ctx.throw(404); }
  const boundaries = results.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson);
    geojson.properties = { name: row.varname_1, id: row.gid };
    return geojson;
  })
  ctx.body = boundaries;
});

module.exports = router;