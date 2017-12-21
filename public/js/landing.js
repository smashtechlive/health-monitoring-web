
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

	var sendUrl = 'http://192.168.33.17:3018/time?startDate=2017-12-18%2001:16:28&endDate=2017-12-19%2021:16:28&page=6000&limit=100';
  var sendResultUrl ='http://192.168.33.17:3018/results?startDate=2017-12-18%2001:16:28&endDate=2017-12-19%2021:16:28&page=6000&limit=100'
  var sendSpeedUrl ='http://192.168.33.17:3018/results?startDate=2017-12-18%2001:16:28&endDate=2017-12-19%2021:16:28&page=6000&limit=100'
  var sendMemoryUrl ='http://192.168.33.17:3018/results?startDate=2017-12-18%2001:16:28&endDate=2017-12-19%2021:16:28&page=6000&limit=100'
  getUrl(sendUrl, function(err, res){
		console.log(res)
		res = JSON.parse(res);

		if(page == 1){
			document.getElementById("grid").innerHTML = "";
		}

    getMixin('time', {"res": res}, function(err, res) {
      var e = document.createElement('div');
      e.innerHTML = res;
      while(e.firstChild) {
          document.getElementById("grid").appendChild(e.firstChild);
      }
    });

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
  
  let nameSelect = document.getElementById('nameSelect')
  let name = nameSelect.value

	let sourceSelect = document.getElementById('sourceSelect')
	let source = sourceSelect.value

	let valueSelect = document.getElementById('valueSelect')
	let value = valueSelect.value

	let limit = 100;//page cannot handle more otherwise get mixin function fails because url string too long since data goes into the mixin url request



	//NOT else if here 

	let url = stringifyVariables(year, month, day, name, source, value);

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
    
    let name = document.getElementById('nameSelect')
		name = 'time'
		nameSelect.value = name 

		let valueSelect = document.getElementById('valueSelect')
		valuesel = '1'
    valueSelect.value = valuesel
    
		let sourceSelect = document.getElementById('sourceSelect')
		source = '1'
    sourceSelect.value = source
    
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