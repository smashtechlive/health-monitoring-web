var apiUrl = null, year1 = null, month1 = null, day1 = null, day2 = null, startHour = null, startMinutes = null,
endHour = null, endMinutes = null, year2 = null, month2 = null, threshold = null,name = null, value = null, reportActionsSetup = false, url = null, setupUIComplete = false;

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
	else if(varName == 'rowType')
		rowType = varValue;
	else if(varName == 'sort')
		sort = varValue;
	else if(varName == 'threshold')
		threshold = varValue;
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
	getMixin('selectionDisplay-2', {"yearSelect1": year1, "monthSelect1": month1, "daySelect1": day1, "threshold": threshold, "name": name, "value": value }, function(err, res) {
		document.getElementById("selectionDisplay").innerHTML = res;

			setTimeout(function() {
				setDefaults()
				afterSetupUI()
			}, 500)
	});
}

function loadContent(){
	url = stringifyVariables(year1,year2, day1, day2, name, threshold, );
	populateData(url, 1)
}

function populateData(url, page) {
 console.log(url);  
  // var sendUrl = 'http://192.168.33.17:3018/time?startDate=2017-12-18T21:16:28.404Z&endDate=2017-12-19T21:16:28.404Z&page=1&limit=100';
 
	
  //  var sendResultUrl ='http://192.168.33.17:3018/results?startDate=2017-12-18%2001:16:28&endDate=2017-12-19%2021:16:28&page=6000&limit=100'
  //  var sendSpeedUrl ='http://192.168.33.17:3018/results?startDate=2017-12-18%2001:16:28&endDate=2017-12-19%2021:16:28&page=6000&limit=100'
  //  var sendMemoryUrl ='http://192.168.33.17:3018/memory?startDate=2017-12-18%2001:16:28&endDate=2017-12-19%2021:16:28&page=6000&limit=100'
  getUrl(url, function(err, res){
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
    getMixin('requests', {"res": res}, function(err, res) {
      var e = document.createElement('div');
      e.innerHTML = res;
      while(e.firstChild) {
          document.getElementById("grid").appendChild(e.firstChild);
      }
    });
    getMixin('memory', {"res": res}, function(err, res) {
      var e = document.createElement('div');
      e.innerHTML = res;
      while(e.firstChild) {
          document.getElementById("grid").appendChild(e.firstChild);
      }
    });
    getMixin('cpu', {"res": res}, function(err, res) {
      var e = document.createElement('div');
      e.innerHTML = res;
      while(e.firstChild) {
          document.getElementById("grid").appendChild(e.firstChild);
      }
    });
    getMixin('storage', {"res": res}, function(err, res) {
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
  console.log('generatereport');
	yearSelect1 = document.getElementById('yearSelect1')
  startYear = yearSelect1.value //year value

  yearSelect2 = document.getElementById('yearSelect2')
  endYear = yearSelect2.value //year value
  
  monthSelect1 = document.getElementById('monthSelect1')
  startMonth = monthSelect1.value //month value
  
 monthSelect2 = document.getElementById('monthSelect2')
	endMonth = monthSelect2.value //month value

  daySelect1 = document.getElementById('daySelect1')
  startDay = daySelect1.value

  daySelect2 = document.getElementById('daySelect2')
  endDay = daySelect2.value

  hourSelect1 = document.getElementById('hourSelect1')
  startHour = hourSelect1.value
  minuteSelect1 = document.getElementById('minuteSelect1')
  startMinutes = minuteSelect1.value
  hourSelect2 = document.getElementById('hourSelect2')
  endHour = hourSelect2.value
  minuteSelect2 = document.getElementById('minuteSelect2')
  endMinutes = minuteSelect2.value

  let startDate = startYear+'-'+startMonth+'-'+startDay+'%20'+startHour+':'+startMinutes+':00'
  console.log(startDate)
  let endDate = endYear+'-'+endMonth+'-'+endDay
  //+'%20'+endHour+':'+endMinutes+':00'// removing end hour and minutes since they are not in the api request
  
    nameSelect = document.getElementById('nameSelect')
  let name = nameSelect.value

	// let sourceSelect = document.getElementById('sourceSelect')
	// let source = sourceSelect.value

	// let valueSelect = document.getElementById('valueSelect')
  // let statValue = valueSelect.value
  
  let thresholdSelect = document.getElementById('thresholdSelect')
  let threshold = thresholdSelect.value

	let limit = 100;//page cannot handle more otherwise get mixin function fails because url string too long since data goes into the mixin url request



	//NOT else if here 

	let url = stringifyVariables(startDate, endDate, name, threshold);

	populateData(url, 1)
}

function setDefaults() {
	if(!setupUIComplete) {
		// let endDates = new Date()
	  //   day = ('0' + (endDate.getDate())).slice(-2)
	  //   month = ('0' + (endDate.getMonth()+1)).slice(-2)
	  //   year = endDate.getFullYear()

	    let yearSelect1 = document.getElementById('yearSelect1')
		 year1 =yearSelect1.value

		let monthSelect1 = document.getElementById('monthSelect1')
		month1 = monthSelect1.value   //month value

		let daySelect1 = document.getElementById('daySelect1')
		day1= daySelect1.value 
    
    let yearSelect2 = document.getElementById('yearSelect2')
		 year2=yearSelect2.value 

		let monthSelect2 = document.getElementById('monthSelect2')
		monthSelect2.value = month2 //month value

		let daySelect2 = document.getElementById('daySelect2')
		day2 = daySelect1.value 
    
    let name = document.getElementById('nameSelect')
	 
		name = nameSelect.value 

		// let valueSelect = document.getElementById('valueSelect')
 
    // valueSel=valueSelect.value  
    
    // let sourceSelect = document.getElementById('sourceSelect')
   
  
     
    //  source = sourceSelect.value 

    let thresholdSelect = document.getElementById('thresholdSelect')
    threshold =thresholdSelect.value 
 
    
    limit = 100
    page = 1
		setupUIComplete = true
		loadContent()	
	}
}

function stringifyVariables(startDate, endDate, name, threshold) {
  
	url = (apiUrl + '/'+name+'?startDate='+startDate+'&endDate='+endDate+'&page='+page+'&limit='+limit+'&threshold='+threshold);
  console.log(url)
  return url;
}

function reportActions() {
	if(!reportActionsSetup) {
		let formSelects = document.getElementsByClassName('form-control')
		for(var i = 0; i < formSelects.length; i++) {
			formSelects[i].addEventListener('change', function() {
				generateReport()
			})
		}
		reportActionsSetup = true
	}
}