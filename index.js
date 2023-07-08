const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-Container");
const userInfoContainer = document.querySelector(".user-info-container");



let currentTab = userTab;
const API_key = "29bdb51bf568aad0a5bf5655c127115e";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        error.classList.remove("active");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            error.classList.remove("active");
        
        }

        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            error.classList.remove("active");
            getfromSessionStorage();
        }

    }
    else{
        error.classList.remove("active");
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}   

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    error.classList.remove("active");

    //API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        error.classList.remove("active");
        renderWeatherInfo(data);
    }   
    catch(err) {
        loadingScreen.classList.remove("active");

    }
}

function renderWeatherInfo(weatherInfo) {
 const cityName =  document.querySelector("[data-cityName]");
 const countryIcon = document.querySelector("[data-countryIcon]");
 const desc = document.querySelector("[data-weatherDesc]");
 const weatherIcon = document.querySelector("[data-weatherIcon]");
 const temp = document.querySelector("[data-temp]");
 const windSpeed = document.querySelector("[data-windspeed]");
 const humidity = document.querySelector("[data-humidity]");
 const cloudiness = document.querySelector("[data-cloudiness]");


 cityName.innerText = weatherInfo?.name;
 countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
 desc.innerText = weatherInfo?.weather?.[0]?.description;
 weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
 temp.innerText = `${weatherInfo?.main?.temp}°C`;
 windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
 humidity.innerText = `${weatherInfo?.main?.humidity}%`;
 cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {

    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})
const error = document.querySelector(".Error");

async function fetchSearchWeatherInfo(city) {
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
          );

        const data = await response.json();
        if(data.cod === `404`) {
            error.classList.add("active");
            loadingScreen.classList.remove("active");

            
        }
        else{
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            error.classList.remove("active");
            renderWeatherInfo(data);
        }
           
        
        
}
 