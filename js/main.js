//Icons
var thunderstorm = "wi wi-thunderstorm";
var drizzle = "wi wi-showers";
var rain = "wi wi-rain";
var snow = "wi wi-snow";
var fog = "wi wi-fog";
var clear = "wi wi-day-sunny";
var cloudy = "wi wi-cloudy";

//Find city option
var findBy = "name";

$('document').ready(function(){
    var cityNameCookie = getCookie("defaultCity");

    if(cityNameCookie == null || cityNameCookie == undefined || cityNameCookie == ""){
        sendRequest("Ostrava");
    }else{
        sendRequest(cityNameCookie);
    }
});

//Set actual city as default
function SetDefaultCity(){
    var cityName = document.getElementById("city").innerHTML;
    setCookie("defaultCity", cityName, 5);
}

//Get weather info
var sendRequest = function(cityParameter){
    
    if(!cityParameter){
        alert("Specify city please");
        return;
    }

    var currentUrl, forecastUrl;

    if(findBy == "name"){
        currentUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
        forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=";
    }

    if(findBy == "zipcode"){
        currentUrl = "http://api.openweathermap.org/data/2.5/weather?zip="
        forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?zip=";
    }

    if(findBy == "id"){
        currentUrl = "http://api.openweathermap.org/data/2.5/weather?id="
        forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?id=";
    }

    //Current weather
    $.get(currentUrl + cityParameter + "&units=metric" + apiKey, function(data){
        document.getElementById("tempNow").innerHTML = data.main.temp.toFixed(1) + "&deg; <small>C</small>";
        document.getElementById("windNow").innerHTML = "<small><small>WIND: </small></small>" + data.wind.speed.toFixed(1) + "km/h";
        document.getElementById("pressureNow").innerHTML = "<small><small>Pressure: </small></small>" + data.main.pressure + "hPa";
        document.getElementById("coords").innerHTML = "longitude: " + data.coord.lon + " lattitude: " + data.coord.lat;
        
        //Set city heading
        document.getElementById("city").innerHTML = data.name;

        var status = data.weather[0].id;
        ChangeStylesByStatus(status, "current");
        setMap(data.coord.lat, data.coord.lon);
    }, "json")
    .fail(function() {
        document.getElementById("cityInput").value = "error";
        return;
    });


    //Hours and days
    $.get(forecastUrl + cityParameter + "&units=metric" + apiKey, function(data){
    
        //Hours
        document.getElementById("tempHours").innerHTML = data.list[0].main.temp.toFixed(1) + "&deg; <small>C</small>";
        document.getElementById("windHours").innerHTML = "<small><small>WIND: </small></small>" + data.list[0].wind.speed.toFixed(1) + "km/h";
        document.getElementById("pressureHours").innerHTML = "<small><small>Pressure: </small></small>" + data.list[0].main.pressure + "hPa";

        var status = data.list[0].weather[0].id;
        ChangeStylesByStatus(status, "hours");

        //Days
        document.getElementById("tempDays").innerHTML = data.list[37].main.temp.toFixed(1) + "&deg; <small>C</small>";
        document.getElementById("windDays").innerHTML = "<small><small>WIND: </small></small>" + data.list[37].wind.speed.toFixed(1) + "km/h";
        document.getElementById("pressureDays").innerHTML = "<small><small>Pressure: </small></small>" + data.list[37].main.pressure + "hPa";

        var status = data.list[37].weather[0].id;
        ChangeStylesByStatus(status, "days");
        
    }, "json")
    .fail(function() {
        document.getElementById("cityInput").value = "error";
        return;
    });

    //Null input
    document.getElementById("cityInput").value = null;
}

//Set icons and forecast items backgrounds by weather status
function ChangeStylesByStatus(status, forecastType){

    var forecastItemId = "forecastItem";
    var forecastIconId = "icon";

    switch(forecastType){
        case "current":{
            forecastItemId += "Now";
            forecastIconId += "Now";
            break;
        }
        case "hours":{
            forecastItemId += "Hours";
            forecastIconId += "Hours";
            break;
        }
        case "days":{
            forecastItemId += "Days";
            forecastIconId += "Days";
            break;
        }
    }

    if(status >= 200 && status < 300){
        document.getElementById(forecastIconId).innerHTML = '<span id="glyphBtn" class="' + thunderstorm + '"></span>';
        document.getElementById(forecastItemId).style.backgroundImage = "url('pictures/thunder.gif')";
    }

    if(status >= 300 && status < 400){
        document.getElementById(forecastIconId).innerHTML = '<span id="glyphBtn" class="' + drizzle + '"></span>';
        document.getElementById(forecastItemId).style.backgroundImage = "url('pictures/drizzle.gif')";
    }

    if(status >= 500 && status < 600){
        document.getElementById(forecastIconId).innerHTML = '<span id="glyphBtn" class="' + rain + '"></span>';
        document.getElementById(forecastItemId).style.backgroundImage = "url('pictures/rain.gif')";
    }

    if(status >= 600 && status < 700){
        document.getElementById(forecastIconId).innerHTML = '<span id="glyphBtn" class="' + snow + '"></span>';
        document.getElementById(forecastItemId).style.backgroundImage = "url('pictures/snow.gif')";
    }

    if(status >= 700 && status < 800){
        document.getElementById(forecastIconId).innerHTML = '<span id="glyphBtn" class="' + fog + '"></span>';
        document.getElementById(forecastItemId).style.backgroundImage = "url('pictures/fog.gif')";
    }

    if(status == 800){
        document.getElementById(forecastIconId).innerHTML = '<span id="glyphBtn" class="' + clear + '"></span>';
        document.getElementById(forecastItemId).style.backgroundImage = "url('pictures/clear.gif')";
    }

    if(status >= 801){
        document.getElementById(forecastIconId).innerHTML = '<span id="glyphBtn" class="' + cloudy + '"></span>';
        document.getElementById(forecastItemId).style.backgroundImage = "url('pictures/clouds.gif')";
    }
}

//Set map coords
function setMap(lat, lng) {
    var coords = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 10, center: coords, mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
    }});

    map.setMapTypeId('hybrid');
    var marker = new google.maps.Marker({position: coords, map: map});
}

//Change find city search by
function ChangeFindBy(option){
    findBy = option;
    document.getElementById("cityInput").placeholder = "enter city "+ option;
}