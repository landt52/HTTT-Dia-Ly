const Koa = require('koa');
const cors = require('kcors');
const log = require('./logger');
const api = require('./api');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const database = require('./database');

const { Pool, Client } = require('pg');
const connectionString = 'postgresql://postgres:password@localhost:5432/vietnamGIS';

const pool = new Pool({
	connectionString: connectionString,
});

const client = new Client({
	connectionString: connectionString,
});

const route = new Koa();
const port = 5000;

localHost = JSON.stringify('http://localhost:8080')
route.use(cors({ localHost }));

route.use(async (ctx, next)=>{
	const start = Date.now();
	await next();
	const responseTime = Date.now() - start;
	log.info(`${ctx.method} ${ctx.status} ${ctx.url} - ${responseTime}`);
});

route.use(async (ctx, next) => {
	try{
		await next();
	} catch(err){
		ctx.status = err.status || 500;
		ctx.body = err.message;
		log.error(`Request Error ${ctx.url} - ${err.message}`);
	}
});

route.use(api.routes(), api.allowedMethods());

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));

app.use(require('express-session')({
  secret: "My secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res){
  res.render("login");
});

app.post("/", async function(req, res){
	const userName = req.body.username;
	const password = req.body.password;
	const results = await database.getUser();
	let checkUser = false;
	
	const userNames = results.map((results)=>{
		return results.username;
	});

	const passwords = results.map((results)=>{
		return results.password;
	});
	
	for (let i=0; i < userNames.length; i++) {
        if ((userName === userNames[i]) && (password == passwords[i])) {
            checkUser = true;
            break;
        }
    }
	
	if(checkUser) res.redirect("/backend");
	else res.redirect('/');
});

app.get("/backend", async function(req, res){
	const results = await database.getDistrictsName();
	res.render("backend", {results: results});
});

app.get("/locations", async function(req, res){
	const results = await database.getAllLocationsInfo();
    res.render("locations", {results: results});
});

app.get("/locations/add", async function(req, res){
	const results = await database.getLocationsType();
	res.render("add", {results: results});
});

app.post("/locations/add", async function(req, res){
	pool.connect(function(err, client, done){
		const name = req.body.name;
		const type = req.body.type;
		const lat = req.body.lat;
		const lng = req.body.lng;
		const summary = req.body.summary;
		const website = req.body.website;
		client.query(`INSERT INTO locations(name, type, lat, lng, summary, website) VALUES('${name}', '${type}', ${lat}, ${lng}, '${summary}', '${website}')`);
		done();

		res.redirect("/locations");
	});
});

app.get("/locations/update/:id", async function(req, res){
	const id = req.params.id;
	const type = await database.getLocationsType()
	const result = await database.getLocationToUpdate(id);
	res.render("update", {result: result.rows[0], type: type});
});

app.post("/locations/update", async function(req, res){
	pool.connect(function(err, client, done){
		const gid = req.body.gid;
		const name = req.body.name;
		const type = req.body.type;
		const lat = req.body.lat;
		const lng = req.body.lng;
		const summary = req.body.summary;
		const website = req.body.website;
		client.query(`UPDATE locations SET name='${name}', type='${type}', lat='${lat}', lng='${lng}', summary='${summary}', website='${website}' WHERE gid='${gid}'`);
		done();

		res.redirect("/locations");
	});
});

app.get("/locations/delete/:id", async function(req, res){
	pool.connect(function(err, client, done){
		const gid = req.params.id;
		client.query(`DELETE FROM locations WHERE gid='${gid}'`);
		done();

		res.redirect("/locations");
	});
});

route.listen(port, ()=>{
	log.info('Server listening at port' + port);
});

app.listen(3000, ()=>{
	log.info('Backend listening at port 3000');
});