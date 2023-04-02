var APIKey = 'd61bd0582ac1a1d03a90bc18af5c2b35';
var city = 'nashville';
var queryGeoURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

var weatherInfoArray = []
var newInfoObject = []

var queryWeatherURL;
var lat;
var lon;
var temp;
var sky;
var humidity;
var windSpeed;

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
            for(e = 0; e < result.list.length; e++){
                temp = result.list[e].main.temp; // the temp is measures in kelvin
                sky = result.list[e].weather[0].main; // displays how the sky will look
                humidity = result.list[e].main.humidity; // displays humidity levels
                windSpeed = result.list[e].wind.speed; // displays wind speed in meters/sec
                date = result.list[e].dt; // displays the date and time
                getWeatherObject();
            }
            console.log(weatherInfoArray)
        }
    })
}

function getWeatherObject(){
    temp = ((temp - 273.15) * (9/5) + 32).toFixed(2);
    humidity = humidity + '%';
    windSpeed = (windSpeed * 2.237).toFixed(2);
    date = dayjs(date * 1000).format('MM/DD/YYYY')

    var newInfoObject= {
        temp: temp + ' °F',
        sky: sky,
        humidity: humidity,
        windSpeed: windSpeed + ' MPH',
        date: date
    }
    if(newInfoObject)
    weatherInfoArray.push(newInfoObject)
}

function addListElements(){

}

getCoordinates();