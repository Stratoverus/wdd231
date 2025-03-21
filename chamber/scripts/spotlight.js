const spotlightsContainer = document.querySelector(".spotlights");

function getRandomSpotlights(members) {
    const eligibleMembers = members.filter(member => member.membership_level === 2 || member.membership_level === 3);

    const numSpotlights = eligibleMembers.length >= 3 ? 3 : (eligibleMembers.length >= 2 ? 2 : eligibleMembers.length);

    return eligibleMembers.sort(() => 0.5 - Math.random()).slice(0, numSpotlights);
}

function displaySpotlights(members) {
    const selectedMembers = getRandomSpotlights(members);
    spotlightsContainer.innerHTML = "";

    selectedMembers.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("spotlight-card");

        card.innerHTML = `
            <div class="card">
                <div class="company-header">
                    <h3 class="company-name">${member.name}</h3>
                    <div class="divider"></div>
                </div>
                <div class="card-content">
                    <img src="images/${member.image}" alt="${member.name} Logo" class="company-logo">
                    <div class="company-details">
                        <p><strong>Phone:</strong> ${member.phone}</p>
                        <p><strong>Address:</strong> ${member.address}</p>
                        <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                        <p><strong>Membership Level:</strong> ${member.membership_level === 3 ? 'Gold' : 'Silver'}</p>
                    </div>
                </div>
            </div>
        `;
        spotlightsContainer.appendChild(card);
    });
}

async function loadSpotlights() {
    const storedMembers = localStorage.getItem("members");
    if (storedMembers) {
        displaySpotlights(JSON.parse(storedMembers));
    } else {
        fetch('https://stratoverus.github.io/wdd231/chamber/data/members.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("members", JSON.stringify(data.members));
                displaySpotlights(data.members);
            })
            .catch(error => console.error("Error loading JSON:", error));
    }
}

loadSpotlights();
