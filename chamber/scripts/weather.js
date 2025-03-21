//Selecting the elements
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const details = document.querySelector('#details');
const highTemp = document.querySelector('#highTemp');
const lowTemp = document.querySelector('#lowTempe');
const humidity = document.querySelector('#humidity');
const sunrise = document.querySelector('#sunrise');
const sunset = document.querySelector('#sunset');
const todayForecast = document.querySelector('#highForecastTemp');
const tomorrowForecast = document.querySelector('#tomorrowForecast');
const twoDaysForecast = document.querySelector('#twoDaysForecast');

//declaring variable urls
const currentUrl='https://api.openweathermap.org/data/2.5/weather?lat=33.4149&lon=-111.5501&units=imperial&appid=b211e91a0804464faa498ac3788f07d0';
const forecastUrl='https://api.openweathermap.org/data/2.5/forecast?lat=33.4149&lon=-111.5501&units=imperial&appid=b211e91a0804464faa498ac3788f07d0';

//Coordinates 33.4149, -111.5501 for Apache Junction

async function fetchWeather() {
    try {
        const response = await fetch(currentUrl);
        if (response.ok) {
            const data = await response.json();
            console.log(data); //I have this for troubleshooting
            displayCurrentWeather(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

async function fetchForecast() {
    try {
        const response = await fetch(forecastUrl);
        if (response.ok) {
            const data = await response.json();
            console.log(data); //I have this for troubleshooting
            displayForecast(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

function displayCurrentWeather(data) {
    currentTemp.innerHTML = `${data.main.temp}&deg;F`;
    const iconsrv = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
    let capDesc = capitalizeFirstLetterOfEachWord(desc)
    weatherIcon.setAttribute('src', iconsrv);
    weatherIcon.setAttribute('alt', desc);
    details.textContent = capDesc;
    highTemp.innerHTML = `${data.main.temp_max}&deg;F`;
    todayForecast.innerHTML = `<b>${data.main.temp_max}&deg;F</b>`;
    lowTemp.innerHTML = `${data.main.temp_min}&deg;F`;
    humidity.textContent = `${data.main.humidity}`;
    sunrise.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    sunset.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
}

function displayForecast(data) {
    const dailyTemps = {};
    data.list.forEach(entry => {
        const date = new Date(entry.dt * 1000);
        const dateString = date.toDateString();
        if (!dailyTemps[dateString]) {
            dailyTemps[dateString] = entry.main.temp_max;
        } else {
            dailyTemps[dateString] = Math.max(dailyTemps[dateString], entry.main.temp_max);
        }
    });
    
    const dates = Object.keys(dailyTemps);
    //if (dates.length > 0) todayForecast.innerHTML = `${dailyTemps[dates[0]]}&deg;F`;
    if (dates.length > 1) tomorrowForecast.innerHTML = `${new Date(dates[1]).toLocaleDateString('en-US', { weekday: 'long' })}: <b>${dailyTemps[dates[1]]}&deg;F</b>`;
    if (dates.length > 2) twoDaysForecast.innerHTML = `${new Date(dates[2]).toLocaleDateString('en-US', { weekday: 'long' })}: <b>${dailyTemps[dates[2]]}&deg;F</b>`;
}

function capitalizeFirstLetterOfEachWord(text) {
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

fetchWeather();
fetchForecast();