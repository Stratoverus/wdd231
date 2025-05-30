const url = 'https://stratoverus.github.io/wdd231/chamber/data/discover.json';

const container = document.querySelector('.locations');

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
                <div class="locationDetails">
                    <figure>
                        <img src="images/${location.image}" alt="${location.name}" loading="lazy" width="300" height="200">
                        <figcaption>${location.imageCaption}</figcaption>
                    </figure>
                    <div>
                        <p>${location.description}</p>
                        <p>${location.address}</p>
                    </div>
                </div>
                <button class="open-modal" onclick="openModal('${location.name}', '${location.extendedDescription}')">Learn More</button>
            </div>  
        `;

        container.appendChild(card);
    });
}

function openModal(title, description) {
    const modal = document.getElementById("modal");
    modal.querySelector(".modalTitle").textContent = title;
    modal.querySelector(".modalContent").textContent = description;
    modal.showModal();
}

function closeModal() {
    document.getElementById("modal").close();
}