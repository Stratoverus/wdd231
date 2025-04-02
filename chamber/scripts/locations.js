const url = 'https://stratoverus.github.io/wdd231/chamber/data/discover.json';

const container = document.querySelector('#locations');

async function getLocationData() {
    const response = await fetch(url);
    const data = await response.json();

    localStorage.setItem("locations", JSON.stringify(data.locations));

    displayLocations(data.locations);
}

getLocationData();

function displayLocations(locations) {
    container.innerHTML = "";

    locations.forEach((location) => {
        const card = document.createElement("div");

        card.innerHTML = `
            <div class="card">
                <h3>${location.name}</h3>
                <img src="images/${location.image}" alt="${location.name}">
                <p>${location.description}</p>
                <button onclick="openModal('${location.name}', '${location.extendedDescription}')">Learn More</button>  
        `;

        container.appendChild(card);
    });
}

function openlModal(title, description) {
    const modal = document.getElementById("modal");
    modal.querySelector(".modalTitle").textContent = title;
    modal.querySelector(".modalContent").textContent = description;
    modal.showModal();
}

function closeModal() {
    document.getElementById("modal").close();
}