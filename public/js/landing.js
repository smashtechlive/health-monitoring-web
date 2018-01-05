var apiUrl = null, startYear = null, startMonth = null, startDay = null, endDay = null, startHour = null, startMinutes = null,
  endHour = null, endMinutes = null, endYear = null, endMonth = null, threshold = null, name = null, isOpen = null,
  limit = 100, page = 1, value = null, reportActionsSetup = false, url = null, setupUIComplete = false;

//remember to add a case to this function, as a global variable at the top of the js file and in the pug file 
//remember these variables are not available immediately...only after about 20 milliseconds 
function setVar(varName, varValue) {
  if (varName == 'apiUrl')
    apiUrl = varValue;
  else if (varName == 'year')
    year = varValue;
  else if (varName == 'month')
    month = varValue;
  else if (varName == 'day')
    day = varValue;
  else if (varName == 'sort')
    sort = varValue;
  else if (varName == 'threshold')
    threshold = varValue;
  else if (varName == 'limit')
    limit = varValue;

}

var domReady = function (callback) {
  document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady(function () {
  setupUI()
})



function setupUI() {
  function createDate(date) {
    day = ('0' + (date.getDate())).slice(-2)
    month = ('0' + (date.getMonth() + 1)).slice(-2)
    year = date.getFullYear()
    hour = date.getHours()
    min = date.getMinutes()
    newDate = year + '-' + month + '-' + day + '%20' + hour + ':' + min + ':00'
    return [newDate, year, month, day, hour, min]
  }
  let endDate = new Date()
  endDateObject = createDate(endDate)
  console.log('EndDate=', endDateObject);

  let startDate = new Date();

  var minute60 = startDate.setMinutes(startDate.getMinutes() - 60);   //using "-60" to subtract 60 minutes from the current time.
  var extract = new Date(minute60);
  startDateObject = createDate(startDate)
  var data = {
    "yearSelect1": startDateObject[1], "monthSelect1": startDateObject[2], "daySelect1": startDateObject[3], "hourSelect1": startDateObject[4], "minuteSelect1": startDateObject[5],
    "yearSelect2": endDateObject[1], "monthSelect2": endDateObject[2], "daySelect2": endDateObject[3], "hourSelect1": endDateObject[4], "minuteSelect2": endDateObject[5],
    "name": "time", "threshold": 1
  }
  getMixin('selectionDisplay-2', data, function (err, res) {
    document.getElementById("selectionDisplay").innerHTML = res;
    setTimeout(function () {
      afterSetupUI()
    }, 500)
  });
  getMixin('time', {
    "res": {
      "yearSelect1": startDateObject[1], "monthSelect1": startDateObject[2], "daySelect1": startDateObject[3], "hourSelect1": startDateObject[4], "minuteSelect1": startDateObject[5],
      "yearSelect2": endDateObject[1], "monthSelect2": endDateObject[2], "daySelect2": endDateObject[3], "hourSelect1": endDateObject[4], "minuteSelect2": endDateObject[5],
      "name": "responseTime", "threshold": 1
    }
  }, function (err, res) {
    var e = document.createElement('div');
    e.innerHTML = res;
    while (e.firstChild) {
      document.getElementById("grid").appendChild(e.firstChild);
    }
  });
  getMixin('requests', {
    "res": {
      "yearSelect1": startDateObject[1], "monthSelect1": startDateObject[2], "daySelect1": startDateObject[3], "hourSelect1": startDateObject[4], "minuteSelect1": startDateObject[5],
      "yearSelect2": endDateObject[1], "monthSelect2": endDateObject[2], "daySelect2": endDateObject[3], "hourSelect1": endDateObject[4], "minuteSelect2": endDateObject[5],
      "name": "requests", "threshold": 1
    }
  }, function (err, res) {
    var e = document.createElement('div');
    e.innerHTML = res;
    while (e.firstChild) {
      document.getElementById("grid").appendChild(e.firstChild);
    }
  });
  getMixin('cpu', {
    "res": {
      "yearSelect1": startDateObject[1], "monthSelect1": startDateObject[2], "daySelect1": startDateObject[3], "hourSelect1": startDateObject[4], "minuteSelect1": startDateObject[5],
      "yearSelect2": endDateObject[1], "monthSelect2": endDateObject[2], "daySelect2": endDateObject[3], "hourSelect1": endDateObject[4], "minuteSelect2": endDateObject[5],
      "name": "cpu", "threshold": 1
    }
  }, function (err, res) {
    JSON.stringify(res, function (key, val) {
      return val.toFixed ? Number(val.toFixed(2)) : val;
    })
    var e = document.createElement('div');
    e.innerHTML = res;
    while (e.firstChild) {
      document.getElementById("grid").appendChild(e.firstChild);
    }
  });
  getMixin('memory', {
    "res": {
      "yearSelect1": startDateObject[1], "monthSelect1": startDateObject[2], "daySelect1": startDateObject[3], "hourSelect1": startDateObject[4], "minuteSelect1": startDateObject[5],
      "yearSelect2": endDateObject[1], "monthSelect2": endDateObject[2], "daySelect2": endDateObject[3], "hourSelect1": endDateObject[4], "minuteSelect2": endDateObject[5],
      "name": "memory", "threshold": 1
    }
  }, function (err, res) {
    var e = document.createElement('div');


    e.innerHTML = res;
    while (e.firstChild) {
      document.getElementById("grid").appendChild(e.firstChild);
    }
  });
  getMixin('storage', {
    "res": {
      "yearSelect1": startDateObject[1], "monthSelect1": startDateObject[2], "daySelect1": startDateObject[3], "hourSelect1": startDateObject[4], "minuteSelect1": startDateObject[5],
      "yearSelect2": endDateObject[1], "monthSelect2": endDateObject[2], "daySelect2": endDateObject[3], "hourSelect1": endDateObject[4], "minuteSelect2": endDateObject[5],
      "name": "storage", "threshold": 1
    }
  }, function (err, res) {
    var e = document.createElement('div');
    e.innerHTML = res;
    while (e.firstChild) {
      document.getElementById("grid").appendChild(e.firstChild);
    }
  });
}
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
function loadContent(startDate, endDate, name) {
  url = stringifyVariables(startDate, endDate, name);
  populateData(url, 1)
}

function populateData(url, page, name) {
  getUrl(url, function (err, res) {
    console.log(res)
    res = JSON.parse(res);
    res.forEach(function(obj){
      obj.utcDateTime = new Date(obj.utcDateTime).toString();
    })
    if (name == 'time') {
      res.forEach(function (obj) {
        obj.value = millisToMinutesAndSeconds(obj.value); //convert miliseconds to minutes
      })
    } else if (name == 'cpu' || name == 'memory') {
      res.forEach(function (obj) {
        obj.value = Number(obj.value.toFixed(2));   // convert ot nearest 2 decimal places
      })
    }

    if (page == 1) {
      document.getElementById("grid").innerHTML = "";
    }
    res.sort(function (a, b) {
      return (a.value) - (b.value);
    });
     
    getMixin(name, { "res": res }, function (err, res) {
      var e = document.createElement('div');
      e.innerHTML = res;
      while (e.firstChild) {
        document.getElementById("grid").appendChild(e.firstChild);
      }
    });

  })
}

function showMoreLines() {
  var elem = document.getElementById('show');
  console.log(elem)
  elem.style.maxHeight = 'none';
}

function afterSetupUI() {
  reportActions();
}

function getMixin(mixin, mixinJson, cb) {
  var mixinJson = JSON.stringify(mixinJson);
  mixin = encodeURIComponent(mixin);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/mixin?mixin=' + mixin + '&mixinJson=' + mixinJson);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4)
      cb(null, xhr.responseText);//still need to add normal GET error handling here
  }
}

function getUrl(url, cb) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4)
      cb(null, xhr.responseText);//still need to add normal GET error handling here
  }
}

function generateReport(name) {



  let yearSelect1 = document.getElementById('yearSelect1')
  startYear = yearSelect1.value

  let yearSelect2 = document.getElementById('yearSelect2')
  endYear = yearSelect2.value

  let monthSelect1 = document.getElementById('monthSelect1')
  startMonth = monthSelect1.value

  let monthSelect2 = document.getElementById('monthSelect2')
  endMonth = monthSelect2.value

  let daySelect1 = document.getElementById('daySelect1')
  startDay = daySelect1.value

  let daySelect2 = document.getElementById('daySelect2')
  endDay = daySelect2.value

  let hourSelect1 = document.getElementById('hourSelect1')
  startHour = hourSelect1.value
  minuteSelect1 = document.getElementById('minuteSelect1')
  startMinutes = minuteSelect1.value
  hourSelect2 = document.getElementById('hourSelect2')
  endHour = hourSelect2.value
  minuteSelect2 = document.getElementById('minuteSelect2')
  endMinutes = minuteSelect2.value

  let startDate = startYear + '-' + startMonth + '-' + startDay + '%20' + startHour + ':' + startMinutes + ':00'
  console.log(startDate)
  let endDate = endYear + '-' + endMonth + '-' + endDay + '%20' + endHour + ':' + endMinutes + ':00'

  let thresholdSelect = document.getElementById('thresholdSelect')
  let threshold = thresholdSelect.value



  let limit = 10;//page cannot handle more otherwise get mixin function fails because url string too long since data goes into the mixin url request
  //NOT else if here 

  let url = stringifyVariables(startDate, endDate, name, threshold);

  populateData(url, 1, name)
}
function stringifyVariables(startDate, endDate, name, threshold) {
  if (threshold == undefined) {
    threshold = null;
  }
  url = (apiUrl + '/' + name + '?startDateTime=' + startDate + '&endDateTime=' + endDate + '&page=' + page + '&limit=' + limit + '&threshold=' + threshold);
  // console.log(url)
  return url;
}
function menuToggle() {
  let menuItems = document.getElementsByClassName('row');
  if (!isOpen) {
    for (var i = 0; i < menuItems.length; i++) {
      menuItems[i].style.display = "inherit";
       
    }
    isOpen = true;
  }
  else {
    for (var i = 0; i < menuItems.length; i++) {
      menuItems[i].style.display = "none";
    }
    isOpen = false;
  }
}

function reportActions() {
  if (!reportActionsSetup) {
    let formSelects = document.getElementsByClassName('form-control')
    for (var i = 0; i < formSelects.length; i++) {
      formSelects[i].addEventListener('change', function () {
        generateReport()
      })
    }
    reportActionsSetup = true
  }
}
