
var apiUrl = null, year = null, month = null, day = null, hour = null, rowType = null, sort = null, reportActionsSetup = false, url = null, setupUIComplete = false;

//remember to add a case to this function, as a global variable at the top of the js file and in the pug file 
//remember these variables are not available immediately...only after about 20 milliseconds 
function setVar(varName, varValue){
	if(varName == 'apiUrl')
		apiUrl = varValue;
	else if(varName == 'year')
		year = varValue;
	else if(varName == 'month')
		month = varValue;
	else if(varName == 'day')
		day = varValue;
	else if(varName == 'hour')
		hour = varValue;
	else if(varName == 'rowType')
		rowType = varValue;
	else if(varName == 'sort')
		sort = varValue;
	else if(varName == 'breakdown')
		breakdown = varValue;
	else if(varName == 'limit')
		limit = varValue;

}

var domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady(function() {
	setupUI()
	// loadContent();//triggered by UI buttons so no page refresh...also can be used for paging 
})

function setupUI() {
	getMixin('selectionDisplay-2', {"year": year, "month": month, "day": day, "hour": hour, "rowType": rowType, "sort": sort}, function(err, res) {
		document.getElementById("selectionDisplay").innerHTML = res;

			setTimeout(function() {
				setDefaults()
				afterSetupUI()
			}, 500)
	});
}

function loadContent(){
	url = stringifyVariables(year, month, day, hour, rowType, sort, limit, breakdown);
	populateData(url, 1)
}

function populateData(url, page) {
	console.log(url)

	var sendUrl = url + '&page=' + page;
	getUrl(sendUrl, function(err, res){
		//console.log(res)
		res = JSON.parse(res);
		

		var rowType = 'person';//default 
		if(res[0])
			rowType = res[0].rowType;

		for(var i = 0; i < res.length; i++){

			if(res[i].rowType == 'adSet')
				res[i].name = res[i].name.replace(/[^0-9a-zA-Z]/g, '');//temp hack prevents page from crashing ...can adjust later 


			//min recommendation algorithm (beta) 

			var weakConfidenceImpressionThreshold = 1000;
			var strongConfidenceImpressionThreshold = 5000;

			if(rowType != 'person'){
				if(res[i].impressions < weakConfidenceImpressionThreshold)
					res[i].recommendation = "Wait";
				else if(res[i].impressions > strongConfidenceImpressionThreshold && res[i].ctr > 0.9 && res[i].cpa > 0.8)
					res[i].recommendation = "BOOST ad";
				else if(res[i].impressions > strongConfidenceImpressionThreshold && res[i].ctr < 0.4 && res[i].cpa < 0.4)
					res[i].recommendation = "STOP ad";
				else if(res[i].impressions > weakConfidenceImpressionThreshold && res[i].ctr > 1.1)
					res[i].recommendation = "Consider Boosting";
				else if(res[i].impressions > weakConfidenceImpressionThreshold && res[i].cpa > 1.1)
					res[i].recommendation = "Consider Boosting";
				else if(res[i].impressions > weakConfidenceImpressionThreshold && res[i].ctr < 0.3)
					res[i].recommendation = "Consider Stopping";
				else if(res[i].impressions > weakConfidenceImpressionThreshold && res[i].cpa < 0.3)
					res[i].recommendation = "Consider Stopping";
			}

		}

		console.log('---> ' + rowType);

		console.log('page '+ page);

		if(page == 1){
			document.getElementById("grid").innerHTML = "";
			

		}

		setTimeout(function(){


			if(rowType == 'person' || rowType == 'group' || rowType == 'crossRange' || rowType == 'agId'){
				getMixin('rowPerson-2', {"res": res}, function(err, res) {
					var e = document.createElement('div');
					e.innerHTML = res;
					while(e.firstChild) {
					  document.getElementById("grid").appendChild(e.firstChild);
					}
				});
			}
			else if(rowType == 'states' || rowType == 'cities'){
				getMixin('rowSales', {"res": res}, function(err, res) {
					var e = document.createElement('div');
					e.innerHTML = res;
					while(e.firstChild) {
					  document.getElementById("grid").appendChild(e.firstChild);
					}
				});
			}
			else if(rowType == 'report'){
				getMixin('rowReport', {"res": res}, function(err, res) {
					var e = document.createElement('div');
					e.innerHTML = res;
					while(e.firstChild) {
					  document.getElementById("grid").appendChild(e.firstChild);
					}
				});
			}
			else if(rowType == 'agIdProducts'){
				getMixin('agIdProducts', {"res": res}, function(err, res) {
					var e = document.createElement('div');
					e.innerHTML = res;
					while(e.firstChild) {
					  document.getElementById("grid").appendChild(e.firstChild);
					}
				});
			}
			else if(rowType == 'agIdPageEvents'){
				getMixin('agIdPageEvents', {"res": res}, function(err, res) {
					var e = document.createElement('div');
					e.innerHTML = res;
					while(e.firstChild) {
					  document.getElementById("grid").appendChild(e.firstChild);
					}
				});
			}
			else if(rowType == 'transactions'){
				getMixin('transactions', {"res": res}, function(err, res) {
					var e = document.createElement('div');
					e.innerHTML = res;
					while(e.firstChild) {
					  document.getElementById("grid").appendChild(e.firstChild);
					}
				});
			}
			else {
				getMixin('row-2', {"res": res}, function(err, res) {
					var e = document.createElement('div');
					e.innerHTML = res;
					while(e.firstChild) {
					  document.getElementById("grid").appendChild(e.firstChild);
					}
				});
			}
		}, 1000)


		if(res.length == 100){
			setTimeout(function(){
				populateData(url, page + 1);//get the next page automatically
			}, 1500);
			
		}

	})
}

function afterSetupUI() {
	reportActions();
}

function getMixin(mixin, mixinJson, cb){

	var mixinJson = JSON.stringify(mixinJson);
	mixin = encodeURIComponent(mixin);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/mixin?mixin='+ mixin +'&mixinJson='+mixinJson);
	xhr.send(null);
	xhr.onreadystatechange = function () {
		if(xhr.readyState == 4)
			cb(null, xhr.responseText);//still need to add normal GET error handling here
	}
}

function getUrl(url, cb){

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.send(null);
	xhr.onreadystatechange = function () {
		if(xhr.readyState == 4)
			cb(null, xhr.responseText);//still need to add normal GET error handling here
	}
}

function generateReport() {
	let yearSelect = document.getElementById('yearSelect')
	let year = yearSelect.value //year value

	let monthSelect = document.getElementById('monthSelect')
	let month = monthSelect.value //month value

	let daySelect = document.getElementById('daySelect')
	let day = daySelect.value

	let hourSelect = document.getElementById('hourSelect')
	let hourValue = hourSelect.value

	let rowSelect = document.getElementById('rowSelect')
	let rowType = rowSelect.value

	let dataSelect = document.getElementById('dataSelect')
	let sort = dataSelect.value

	let limit = 100;//page cannot handle more otherwise get mixin function fails because url string too long since data goes into the mixin url request

	let breakdown = 'hour'


	//NOT else if here 

	if(hourValue == 'all')
		breakdown = 'day';
	if(day == 'all')
		breakdown = 'month';
	if(month == 'all')
		breakdown = 'year';

	let hour = '00';


	if(hourValue == '12am')
		hour = '00';
	else if(hourValue == '1am')
		hour = '01';
	else if(hourValue == '2am')
		hour = '02';
	else if(hourValue == '3am')
		hour = '03';
	else if(hourValue == '4am')
		hour = '04';
	else if(hourValue == '5am')
		hour = '05';
	else if(hourValue == '6am')
		hour = '06';
	else if(hourValue == '7am')
		hour = '07';
	else if(hourValue == '8am')
		hour = '08';
	else if(hourValue == '9am')
		hour = '09';
	else if(hourValue == '10am')
		hour = '10';
	else if(hourValue == '11am')
		hour = '11';
	else if(hourValue == '12pm')
		hour = '12';
	else if(hourValue == '1pm')
		hour = '13';
	else if(hourValue == '2pm')
		hour = '14';
	else if(hourValue == '3pm')
		hour = '15';
	else if(hourValue == '4pm')
		hour = '16';
	else if(hourValue == '5pm')
		hour = '17';
	else if(hourValue == '6pm')
		hour = '18';
	else if(hourValue == '7pm')
		hour = '19';
	else if(hourValue == '8pm')
		hour = '20';
	else if(hourValue == '9pm')
		hour = '21';
	else if(hourValue == '10pm')
		hour = '22';
	else if(hourValue == '11pm')
		hour = '23';

	if(day == 'all')
		day = '01';

	if(sort == 'revenue')
		sort = 'sales';//database and API was all built to be called 'sales' but since Kendra said Revenue is better for the dashboard display that is why just for display we use the term revenue

	if(sort == 'roas')
		sort = 'healthIndex';//database and API was all built to be called 'healthIndex' but roas is the correct term for the dashboard display that is why just for display we use the term roas

	let url = stringifyVariables(year, month, day, hour, rowType, sort, limit, breakdown);

	populateData(url, 1)
}

function setDefaults() {
	if(!setupUIComplete) {
		let endDate = new Date()
	    day = ('0' + (endDate.getDate())).slice(-2)
	    month = ('0' + (endDate.getMonth()+1)).slice(-2)
	    year = endDate.getFullYear()

	    let yearSelect = document.getElementById('yearSelect')
		yearSelect.value = year

		let monthSelect = document.getElementById('monthSelect')
		monthSelect.value = month //month value

		let daySelect = document.getElementById('daySelect')
		daySelect.value = day

		let hourSelect = document.getElementById('hourSelect')
		hour = 'all'
		hourSelect.value = hour

		let rowSelect = document.getElementById('rowSelect')
		rowType = 'person'
		rowSelect.value = rowType

		let dataSelect = document.getElementById('dataSelect')
		sort = 'points'
		dataSelect.value = sort

		limit = 100
		breakdown = 'day'
		setupUIComplete = true
		loadContent()
		
	}

}

function stringifyVariables(year, month, day, hour, rowType, sort, limit, breakdown) {
	if(breakdown == 'hour')
		url = apiUrl + '/'+breakdown+'?dateTime='+year+'-'+month+'-'+day+'%20'+hour+':00:00&rowType='+rowType+'&sort='+sort+'&limit='+limit;
	else if(breakdown == 'day')
		url = apiUrl + '/'+breakdown+'?date='+year+'-'+month+'-'+day+'&rowType='+rowType+'&sort='+sort+'&limit='+limit;
	else if(breakdown == 'month')
		url = apiUrl + '/'+breakdown+'?date='+year+'-'+month+'-'+day+'&rowType='+rowType+'&sort='+sort+'&limit='+limit;
	return url;
}

function reportActions() {
	if(!reportActionsSetup) {
		let formSelects = document.getElementsByClassName('form-select')
		for(var i = 0; i < formSelects.length; i++) {
			formSelects[i].addEventListener('change', function() {
				generateReport()
			})
		}
		reportActionsSetup = true
	}
}