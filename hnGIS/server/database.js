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
	getLocations: async (type) => {
		const locationQuery = `
		    SELECT ST_AsGeoJSON(ST_MakePoint(lng, lat),4326), name, type, gid
		    FROM locations
		    WHERE UPPER(type) = UPPER($1);`;
		const result = await client.query(locationQuery, [type]);
		return result.rows;
	},

	getCityBoundaries: async () => {
	  	const boundaryQuery = `
	    	SELECT ST_AsGeoJSON(geom), name_2, gid
	    	FROM districts;`;
	  	const result = await client.query(boundaryQuery);
	  	return result.rows;
	},

	getDistrictSize: async (id) => {
		const sizeQuery = `
			SELECT ST_AREA(geom) as size
			FROM districts
			WHERE gid = $1
			LIMIT(1);`;
		const result = await client.query(sizeQuery, [id]);
		return result.rows[0];
	},

	getSummary: async (table, id) => {
		if (table !== 'locations') {
		    throw new Error(`Invalid Table - ${table}`);
		}

		const summaryQuery = `
		    SELECT summary
		    FROM ${table}
		    WHERE gid = $1
		    LIMIT(1);`;
		const result = await client.query(summaryQuery, [id]);
		return result.rows[0];
	},

	getUser: async () => {
		const userQuery = `
			SELECT *
			FROM users`;
		const result = await client.query(userQuery);
		return result.rows;
	},

	getDistrictsName: async () => {
		const districtsNameQuery = `
			SELECT name_2
			FROM districts`;
		const results = await client.query(districtsNameQuery);
		return results.rows;
	},

	getAllLocationsInfo: async () => {
		const allLocationsInfoQuery = `
			SELECT *
			FROM locations
			ORDER BY gid ASC`;
		const result = await client.query(allLocationsInfoQuery);
		return result.rows;
	},

	getLocationsType: async () => {
		const locationsType = `
			SELECT DISTINCT type
			FROM locations`;
		const result = await client.query(locationsType);
		return result.rows;	
	},

	getLocationToUpdate: async (id) => {
		const locationToUpdate = `
			SELECT *
			FROM locations
			WHERE gid = $1`;
		const result = await client.query(locationToUpdate, [id]);
		return result;
	}
}


