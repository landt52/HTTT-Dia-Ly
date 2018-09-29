const path = require('path');

module.exports={
	entry: './app/main1.js',
	output:{
		path: path.resolve(__dirname, 'public'),
		filename: 'main.js'
	},
	mode: 'development'
};