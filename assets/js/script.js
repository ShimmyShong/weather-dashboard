var APIKey = 'd61bd0582ac1a1d03a90bc18af5c2b35';
var city = 'nashville';
var queryGeoURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

var queryWeatherURL;
var lat;
var lon;

function getCoordinates(){
    $.ajax({
        url: queryGeoURL,
        success: function(result){
            console.log(result)
            lat = result.coord.lat;
            lon = result.coord.lon;
            console.log(`${lat}, ${lon}`);
            queryWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey;
            getWeatherDays();
        }
    })
}

function getWeatherDays(){
    $.ajax({
        url: queryWeatherURL,
        success: function(result){
            console.log(result)
            console.log(result.list[0].main.temp) // the temp is measures in kelvin
            console.log(result.list[0].weather[0].main) // displays how the sky will look
        }
    })
}


getCoordinates();