const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //User enters a city name and removes the extra spaces. 
    if(!cityName) return; //Returns if the cityName is empty

    console.log(cityName)
}
searchButton.addEventListener("click", getCityCoordinates)
