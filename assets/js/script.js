const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

var API_KEY = "326e7676a644e6577149cca778a9a067"; // API key

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+API_KEY+"";

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data);
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
        console.log(data);
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error has occurred while fetching the coordinates!")
    });
}
searchButton.addEventListener("click", getCityCoordinates)