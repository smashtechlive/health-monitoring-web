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

	app.get("/login", (req, res) => {
		res.cookie('user', req.query.user, { expires: new Date(Date.now() + 3*60*60*1000) });  //3 hr cookie to protect stats page 
		res.cookie('pass', req.query.pass, { expires: new Date(Date.now() + 3*60*60*1000) });  //3 hr cookie to protect stats page 
    res.redirect('/dashboard');
	});

	app.get("/dashboard", (req, res) => {
	   
		if(req.cookies.user && req.cookies.pass){

			if(req.cookies.user == 'smashtech' && (req.cookies.pass == 'hk8svT$!' || req.cookies.pass == 'hk8svT$')){

			  res.render("dashboard-2", { 
			    apiUrl: config.apiUrl
			    , year: req.query.year
			    , month: req.query.month
			    , day: req.query.day
			    , hour: req.query.hour
			    , rowType: req.query.rowType 
			    , sort: req.query.sort 
			    , breakdown: req.query.breakdown 
			    , limit: req.query.limit 
			  });
			} 
			else 
			res.json({"err": "Please provide a correct user and pass."});
		}
		else 
			res.json({"err": "Please provide a user and pass."});

	});

	app.get("/dashboard-raw", (req, res) => {
	   
	  res.render("dashboard", { 
	    apiUrl: config.apiUrl
	    , year: req.query.year
	    , month: req.query.month
	    , day: req.query.day
	    , hour: req.query.hour
	    , rowType: req.query.rowType 
	    , sort: req.query.sort 
	    , breakdown: req.query.breakdown 
	    , limit: req.query.limit 
	  });

	});

}