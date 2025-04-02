const url = 'https://stratoverus.github.io/wdd231/chamber/data/discover.json';

const container = document.querySelector('#locations');

async function getLocationData() {
    const response = await fetch(url);
    const data = await response.json();

    //I've heard I need to save this to make it fast for toggling.
    localStorage.setItem("locations", JSON.stringify(data.locations));

    displayLocations(data.locations);
}

getLocationData();

