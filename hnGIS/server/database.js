const { Pool, Client } = require('pg');
const log = require('./logger');
const connectionString = ;

const pool = new Pool({
  connectionString: connectionString,
});

const client = new Client({
  connectionString: connectionString,
});

client.connect().then(() => {
  log.info(`Connected To ${client.database} at ${client.host}:${client.port}`);
}).catch(log.error)

module.exports = {
	getCityBoundaries: async () => {
	  const boundaryQuery = `
	    SELECT ST_AsGeoJSON(geom), varname_1, gid
	    FROM cities
	    WHERE gid = 23;`;
	  const result = await client.query(boundaryQuery);
	  return result.rows;
	}
}


