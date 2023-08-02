const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather")
const weatherCardsDiv = document.querySelector(".weather-cards");

const historyDiv = document.querySelector(".history-card")


const API_KEY = "326e7676a644e6577149cca778a9a067"; // API key

const createWeatherCard = (cityName, weatherItem, index) => {
    const kelvinTemp = weatherItem.main.temp;
    const fahrenheitTemp = (kelvinTemp - 273.15) * 9/5 + 32;
    const formattedTemp = fahrenheitTemp.toFixed(2);
    if (index === 0) { //HTML for main weather card
        return ' <div class="details"> \
                    <h2>'+cityName+' ('+weatherItem.dt_txt.split(" ")[0]+')</h2> \
                    <h4>Temperature: '+formattedTemp+'°F</h4> \
                    <h4>Wind: '+(weatherItem.wind.speed * 2.237).toFixed(2)+'MPH</h4> \
                    <h4>Humidity: '+weatherItem.main.humidity+'%</h4> \
                </div> \
                <div class="icon"> \
                    <img src="https://openweathermap.org/img/wn/'+weatherItem.weather[0].icon+'@4x.png" alt="rain cloud with rain below and sun behind"> \
                    <h4>'+weatherItem.weather[0].description+'</h4> \
                </div>';
    } else { //HTML for the 5 weather cards
        return '<li class="card"> \
                <h3>('+weatherItem.dt_txt.split(" ")[0]+')</h3> \
                <img src="https://openweathermap.org/img/wn/'+weatherItem.weather[0].icon+'@2x.png" alt="rain cloud with rain below and sun behind"> \
                <h4>Temp: '+formattedTemp+'°F</h4> \
                <h4>Wind: '+(weatherItem.wind.speed * 2.237).toFixed(2)+' MPH</h4> \
                <h4>Humidity: '+weatherItem.main.humidity+'%</h4> \
            </li>';
    }
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

        //clearing the previous weather data
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML = "";

        //adds the cards to the page and adds to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => { 
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert("An error has occurred while fetching the weather forecast!")
    });
}

const getCityCoordinates = () => {
    var cityName = cityInput.value.trim(); //User enters a city name and removes the extra spaces. 
    if(!cityName) return; //Returns if the cityName is empty
    saveCityToLocalStorage(cityName);

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

const saveCityToLocalStorage = (cityName) => {
    let history = localStorage.getItem("searchHistory") || "[]";
    history = JSON.parse(history);
    
    // Adds the cityName to the history array
    if (!history.includes(cityName)) {
        history.push(cityName);
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }
}

const displaySearchHistory = () => {
    var cityName = cityInput.value.trim();
    const history = localStorage.getItem("searchHistory");
    if (history) {
        const historyList = JSON.parse(history);
        historyDiv.innerHTML = ""+cityName+"";
        
        // Creates and adds buttons for each city in the history
        historyList.forEach((city) => {
            const historyButton = document.createElement('button');
            historyButton.textContent = city;
            historyButton.addEventListener('click', () => {
                cityInput.value = city;
                getCityCoordinates();
            });
            historyDiv.appendChild(historyButton);
        });
    }
}

searchButton.addEventListener("click", getCityCoordinates)

displaySearchHistory();