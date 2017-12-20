var config = require('../lib/config')
const pug = require('pug')

module.exports = function(app){

	app.get('/ping', function (req, res) {
	  res.end('1');//for health checks 
	});

	app.get("/mixin", (req, res) => {
	    var mixinJson = JSON.parse(req.query.mixinJson);
	    var mixin = decodeURIComponent(req.query.mixin);
	    var html = pug.renderFile(__dirname + '/../views/mixins/' + mixin + '.pug', mixinJson);//do a filesystem cache here of the rendered html to save 120-300ms 
	    res.send(html);
	});

	app.get("/landing", (req, res) => {

			  res.render("landing", { 
			    apiUrl: config.apiUrl
			  });

	});

}