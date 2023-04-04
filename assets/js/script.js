var APIKey = 'd61bd0582ac1a1d03a90bc18af5c2b35';
var queryGeoURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

var buttonEl = $('.btn');

var weatherInfoArray = [];
var newInfoObject = [];
var usedDays = [];

var queryWeatherURL;
var city;
var lat;
var lon;
var temp;
var sky;
var humidity;
var windSpeed;

function getCoordinates(){ // this function takes in the city name and returns the latitude and longitude
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

function getWeatherDays(){ // this function takes in the latitude and longitude and gives lots of weather information that spans out multiple days
    $.ajax({
        url: queryWeatherURL,
        success: function(result){
            for(e = 0; e < result.list.length; e++){
                temp = result.list[e].main.temp; // the temp is measures in kelvin
                sky = result.list[e].weather[0].icon; // displays how the sky will look
                skyURL = 'http://openweathermap.org/img/w/' + sky + '.png';
                humidity = result.list[e].main.humidity; // displays humidity levels
                windSpeed = result.list[e].wind.speed; // displays wind speed in meters/sec
                date = result.list[e].dt; // displays the date and time
                getWeatherObject();
                addCardElements();
            }
            console.log(weatherInfoArray)
        }
    })
}

function getWeatherObject(){ // converts variables to more proper values then pushes an object with those variables into the weatherInfoArray
    temp = ((temp - 273.15) * (9/5) + 32).toFixed(2); // toFixed() method changes how many decimal points a float goes to
    humidity = humidity + '%';
    windSpeed = (windSpeed * 2.237).toFixed(2);
    date = dayjs(date * 1000).format('MM/DD/YYYY'); // date is displayed with unix, multiplying it by 1000 can allow us to format it into a more normal fashion for some reason

    var newInfoObject= {
        temp: temp + ' °F',
        sky: skyURL,
        humidity: humidity,
        windSpeed: windSpeed + ' MPH',
        date: date
    }
    if(newInfoObject);
    weatherInfoArray.push(newInfoObject);
}

function addCardElements(){ // adds card elements and classes depending on which city is typed in
    var titleEl = $('<div>');
    var cardEl1 = $('<div>');
    var cardEl2 = $('<img>').attr('src', `${weatherInfoArray[e].sky}`);
    cardEl2.css({
        width: '15%',
        margin: 'auto',
    })
    var cardEl3 = $('<div>');
    var cardEl4 = $('<div>');
    var containerEl = $('#cards-container');
    titleEl.addClass('border card-header d-flex flex-column align-items-center m-1')
    cardEl1.addClass('card-text d-flex flex-column align-items-center m-1')
    cardEl2.addClass('d-flex flex-column align-items-center')
    cardEl3.addClass('card-text d-flex flex-column align-items-center m-1')
    cardEl4.addClass('card-text d-flex flex-column align-items-center m-1')
    titleEl.text(`${weatherInfoArray[e].date}`);
    cardEl1.text(`${weatherInfoArray[e].temp}`);
    cardEl3.text(`${weatherInfoArray[e].humidity}`);
    cardEl4.text(`${weatherInfoArray[e].windSpeed}`);
    if (!usedDays.includes(weatherInfoArray[e].date)){ // this if statement filters out days that were already appended before
        console.log('pushing to array')
        usedDays.push(weatherInfoArray[e].date);
        containerEl.append(titleEl)
        containerEl.append(cardEl1);
        containerEl.append(cardEl2);
        containerEl.append(cardEl3);
        containerEl.append(cardEl4);
    }else{
        console.log('not pushed to array')
    }
    console.log(usedDays)
    // console.log(divEl.text())
}

buttonEl.on('click', function(event){
    event.preventDefault();
    usedDays = []; // need to reset the arrays on each click so that they can be used again in the functions
    weatherInfoArray = [];
    $('#cards-container').empty(); // similarly to the arrays, the elements in the card container id needed to be emptied
    city = $('#city-input').val().toLowerCase()// this forces the user's input to have the same format to reduce duplicates
    console.log(city)
    queryGeoURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey; // needed to redefine the URL in this eventlistener because it wouldnt work properly otherwise for reasons i dont understand
    console.log(queryGeoURL)

    var previousCities = JSON.parse(localStorage.getItem('previousCities')) || [];  // gets previous cities from local storage
    console.log(previousCities)
    if (!previousCities.includes(city)) { // adds the current city to the list of previous cities if it doesn't already exist
        previousCities.push(city);
        localStorage.setItem('previousCities', JSON.stringify(previousCities));
    }

    queryGeoURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    getCoordinates();
})

var previousCities = JSON.parse(localStorage.getItem('previousCities')); // this gets the previously searched cities from local storage and adds them in the sidebar
var sidebarEl = $('#sidebar');
if (previousCities){
    previousCities.forEach(function(city) {
        var cityEl = $('<li>').addClass('list-group-item position-relative m-0').text(city);
        sidebarEl.append(cityEl);
    
        // Add a click event listener to the cityEl element
        cityEl.on('click', function(event) {
            event.preventDefault();
            usedDays = [];
            weatherInfoArray = [];
            $('#cards-container').empty();
            city = $(this).text().trim(); // get the city name from the clicked element
            queryGeoURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
            getCoordinates();
        });
    });
}

