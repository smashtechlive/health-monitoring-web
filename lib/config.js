let rmqUrl = null, rmqUser = null, rmqPass = null;

if(process.env.commonSetup == "localhost"){
	process.env.NODE_ENV = 'development';
	process.env.rmq = 'stage';
	process.env.api = 'localhost';
}
else if(process.env.commonSetup == "stage"){
	process.env.NODE_ENV = 'development';
	process.env.rmq = 'stage';
	process.env.api = 'stage';
}

exports.logEnv = process.env.commonSetup || process.env.api;

if(process.env.rmq == 'stage'){
	rmqUrl = "stage-log-rmq.skinnyfit.com";
	rmqUser = "smashtech";
	rmqPass = "rabbit13242017";
	exports.rmqConnectionString = 'amqp://'+rmqUser+':'+rmqPass+'@'+ rmqUrl;
}
else if(process.env.rmq == 'production'){
	rmqUrl = "log-rmq.skinnyfit.com";
	rmqUser = "smashtech";
	rmqPass = "rabbit13242017";
	exports.rmqConnectionString = 'amqp://'+rmqUser+':'+rmqPass+'@'+ rmqUrl;
}
else {
	console.log('');
	console.log('------------------------------------------------------------------------------');
	console.log('You MUST set rmq environment variable. (stage/production) ');
	console.log('------------------------------------------------------------------------------');
	console.log('');
}

exports.logEnv = process.env.commonSetup || process.env.db;


if(process.env.api == 'localhost')
	exports.apiUrl = "http://192.168.33.13:3005";
else if(process.env.api == 'stage')
	exports.apiUrl = "http://ec2-52-53-223-224.us-west-1.compute.amazonaws.com";
else {
	console.log('');
	console.log('------------------------------------------------------------------------------');
	console.log("ERROR: You must set api environment variable!  (localhost/stage/production)");
	console.log('------------------------------------------------------------------------------');
	console.log('');
	exports.apiUrl = null;
}

exports.appPort = 3004;

console.log('');
console.log('---------------------------------------------------------');
console.log("API URL: ", exports.apiUrl);//WITHOUT PASSWORD AND USERNAME 
console.log("RMQ URL: ", rmqUrl);//WITHOUT PASSWORD AND USERNAME 
console.log("NODE_ENV: ", process.env.NODE_ENV);
console.log('---------------------------------------------------------');
console.log('');

exports.rmqServerName = "stats-web";//ideally match repo name 