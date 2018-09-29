const { Pool, Client } = require('pg');
const log = require('./logger');
const connectionString = 'postgresql://postgres:password@localhost:5432/vietnamGIS';

const pool = new Pool({
	connectionString: connectionString,
});

const client = new Client({
	connectionString: connectionString,
});

client.connect().then(()=>{
	log.info(`Connected To ${client.database} at ${client.host}:${client.port}`);
}).catch(log.error)

module.exports = {
	getCityBoundaries: async ()=>{
	  	const boundaryQuery = `
	    	SELECT ST_AsGeoJSON(geom), name_2, gid
	    	FROM districts;`;
	  	const result = await client.query(boundaryQuery);
	  	return result.rows;
	},

	getDistrictSize: async (id)=>{
		const sizeQuery = `
			SELECT ST_AREA(geom) as size
			FROM districts
			WHERE gid = $1
			LIMIT(1);`;
		const result = await client.query(sizeQuery, [id]);
		return result.rows[0];
	}
}


