const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "326e7676a644e6577149cca778a9a067"; // API key

const createWeatherCard = (weatherItem) => {
    return '<li class="card"> \
                <h3>('+weatherItem.dt_txt.split(" ")[0]+')</h3> \
                <img src="https://openweathermap.org/img/wn/'+weatherItem.weather[0].icon+'@2x.png" alt="rain cloud with rain below and sun behind"> \
                <h4>Temperature: '+(weatherItem.main.temp - 273.15.toFixed(2))+'°F</h4> \
                <h4>Wind: '+weatherItem.wind.speed+' MPH</h4> \
                <h4>Humidity: '+weatherItem.main.humidity+'%</h4> \
            </li>';
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+API_KEY+"";

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        //Filter the forecasts to get only one forecast each day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach(weatherItem => {
            createWeatherCard(weatherItem);
        })
    }).catch(() => {
        alert("An error has occurred while fetching the weather forecast!")
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //User enters a city name and removes the extra spaces. 
    if(!cityName) return; //Returns if the cityName is empty
    const GEOCODING_API_URL = "https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid="+API_KEY+"";

    //Get city coordinates from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert("No coordinates fount for "+cityName+"");
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error has occurred while fetching the coordinates!")
    });
}
searchButton.addEventListener("click", getCityCoordinates)