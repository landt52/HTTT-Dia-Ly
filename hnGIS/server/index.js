const Koa = require('koa');
const cors = require('kcors');
const log = require('./logger');
const api = require('./api');

const app = new Koa();
const port = 5000;

localHost = JSON.stringify('http://localhost:8080')
app.use(cors({ localHost }));

app.use(async (ctx, next)=>{
	const start = Date.now();
	await next();
	const responseTime = Date.now() - start;
	log.info(`${ctx.method} ${ctx.status} ${ctx.url} - ${responseTime}`);
});

app.use(async (ctx, next) => {
	try{
		await next();
	} catch(err){
		ctx.status = err.status || 500;
		ctx.body = err.message;
		log.error(`Request Error ${ctx.url} - ${err.message}`);
	}
});

app.use(api.routes(), api.allowedMethods());

app.listen(port, ()=>{
	log.info('Server listening at port' + port);
})