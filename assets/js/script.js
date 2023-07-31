const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

const API_KEY = "326e7676a644e6577149cca778a9a067"; // API key

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //User enters a city name and removes the extra spaces. 
    if(!cityName) return; //Returns if the cityName is empty
    const GEOCODING_API_URL = 'http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API key}'

    fetch(GEOCODING_API_URL).then(res=> res.json()).then(data => {
        console.log(data)
    }).catch(() => {
        alert("An error has occurred while fetching the coordinates!")
    });
}
searchButton.addEventListener("click", getCityCoordinates)
