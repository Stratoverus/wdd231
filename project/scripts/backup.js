// gallery.js - Homepage gallery display
const homepageGallery = document.querySelector(".homepage-gallery");

async function loadHomepageCards() {
    console.log("Loading homepage cards...");

    const cards = await fetchCardsOver5Dollars();  // Fetch the cards with price > $5
    console.log("Fetched cards:", cards);  // Log the list of cards fetched

    //Filtering out cards here
    const filteredCards = cards.filter(card => {
        const loweredSet = card["Set"].toLowerCase();
        return !loweredSet.includes("promo") && !loweredSet.includes("prize");
    });
    console.log("Filtered cards (no promo/prize sets):", filteredCards);

    // Shuffle and display the first 6 cards
    const randomCards = shuffleArray(filteredCards).slice(0, 6);
    console.log("Randomly selected cards:", randomCards);

    for (let card of randomCards) {
        console.log(`Processing card: ${card["Product Name"]} from set: ${card["Set"]}`);
        
        const cardData = await fetchCardDetailsFromAPI(card);
        const cardImageUrl = cardData?.images?.small;
    
        console.log("Image URL for card:", cardImageUrl);
    
        if (cardImageUrl) {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.innerHTML = `
                <img src="${cardImageUrl}" alt="${card["Product Name"]}" 
                     data-name="${card["Product Name"]}" 
                     data-set="${card["Set"]}" 
                     class="card-image">
            `;
            cardElement.querySelector("img").addEventListener("click", openModal);
            homepageGallery.appendChild(cardElement);
        }
    }
    
}

async function fetchCardsOver5Dollars() {
    // Fetch cards from your JSON
    const cards = await fetch('data/cards.json').then(response => response.json());

    // Filter cards:
    return cards.filter(card =>
        card["Market Price (As of 2025-04-09)"] > 5 &&
        card["Category"] !== "Promo" &&
        card["Category"] !== "Prize"
    );
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5); // Simple shuffle function
}

function openModal(event) {
    const cardName = event.target.dataset.name;
    const cardSet = event.target.dataset.set;
    
    fetchCardDetailsFromAPI(cardName, cardSet).then(cardDetails => {
        if (cardDetails) {
            // Populate modal with high-res image and details
            const modalImage = document.getElementById("modal-img");
            const modalTitle = document.getElementById("modal-title");
            const modalSet = document.getElementById("modal-set");
            const modalRarity = document.getElementById("modal-rarity");
            const modalPrice = document.getElementById("modal-price");

            modalImage.src = cardDetails.images.large; // High-res image
            modalTitle.textContent = cardDetails.name;
            modalSet.textContent = cardDetails.set.name;
            modalRarity.textContent = cardDetails.rarity;
            modalPrice.textContent = cardDetails.card_prices[0].market_price; // Adjust if necessary

            // Show the modal
            const modal = document.getElementById("card-modal");
            modal.style.display = "block";
        }
    });
}

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("card-modal").style.display = "none"; // Close the modal
});

// Initialize homepage
loadHomepageCards();




const API_URL = "https://api.pokemontcg.io/v2/cards";
const API_KEY = "b9e7ce0c-fd1a-4e86-8b53-1325fb1f90e6"; // Replace with your actual API key

async function fetchCardDetailsFromAPI(card) {
    // Raw values
    let rawSet = card["Set"].trim();
    let rawCardNumber = card["Card Number"].split("/")[0].trim();


    // === 1. Sanitize Set Name ===

    // a) If starts with "SV:", remove it (e.g., "SV: 151" ➝ "151")
    if (/^sv:\s*/i.test(rawSet)) {
        rawSet = rawSet.replace(/^sv:\s*/i, "").trim();
    }

    // b) Remove everything after ":" (e.g., "Crown Zenith: Galarian Gallery" ➝ "Crown Zenith")
    if (rawSet.includes(":")) {
        rawSet = rawSet.split(":")[0].trim();
    }



    // === 2. Trim leading zeros from card number ===
    const number = rawCardNumber.replace(/^0+/, ""); // "038" ➝ "38"

    // === 3. Build query ===
    const query = `q=set.name:"${encodeURIComponent(rawSet)}"+number:${number}`;
    const requestUrl = `${API_URL}?${query}`;

    console.log("🔎 Final API Request:", requestUrl);

    try {
        const response = await fetch(requestUrl, {
            headers: {
                "X-Api-Key": API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Bad response: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ API response:", data);

        return data.data[0] || null;

    } catch (err) {
        console.error("❌ Error fetching card:", err);
        return null;
    }
}