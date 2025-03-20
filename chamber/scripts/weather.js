//Selecting the elements
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const figureCaption = document.querySelector('figcaption');

//declaring variable url
const currentUrl='https://api.openweathermap.org/data/2.5/weather?lat=33.4149&lon=-111.5501&units=imperial&appid=b211e91a0804464faa498ac3788f07d0';
const forecastUrl='https://api.openweathermap.org/data/2.5/forecast?lat=33.4149&lon=-111.5501&units=imperial&appid=b211e91a0804464faa498ac3788f07d0';


//Coordinates 33.4149, -111.5501 for Apache Junction

async function apiFetch () {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayResults(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

function displayResults(data) {
    currentTemp.innerHTML = `${data.main.temp}&deg;F`;
    const iconsrv = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    let desc = data.weather[0].main;
    weatherIcon.setAttribute('src', iconsrv);
    weatherIcon.setAttribute('alt', desc);
    figureCaption.textContent = `${desc}`;
}

function displayForecastResults(data) {
    
}

apiFetch();