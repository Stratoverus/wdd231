import { fetchMultipleCardDetails } from './tcgapi.js';

const homepageGallery = document.querySelector(".homepage-gallery");
const STORAGE_KEY = 'pokemonCardDetails';

function normalizeSetName(setName) {
    let name = setName.trim();
    
    if (/^sv:\s*151/i.test(name)) {
        return "151";
    }
    
    if (/crown zenith:?\s*(?:galarian gallery)?/i.test(name)) {
        return "Crown Zenith";
    }

    if (/scarlet\s*&\s*violet\s*base\s*set/i.test(name)) {
        return "Scarlet & Violet";
    }
    
    if (name.includes(":")) {
        name = name.split(":")[0].trim();
    }
    
    return name;
}

async function loadHomepageCards() {
    const cards = await fetchCardsOver5Dollars();
    const filteredCards = cards.filter(card => {
        const loweredSet = card["Set"].toLowerCase();
        return !loweredSet.includes("promo") && !loweredSet.includes("prize");
    });

    const randomCards = shuffleArray(filteredCards).slice(0, 6);
    const cardDetails = await fetchMultipleCardDetails(randomCards);

    //Use local storage here to make sure the modal uses that data that is already retrieved.
    const storedCards = new Map();
    cardDetails.forEach(card => {
        const storageKey = `${card.set.name}-${card.number}`;
        storedCards.set(storageKey, card);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(storedCards.entries())));

    //This is to fix some issues with Crown Zenith cards
    const cardMap = new Map(
        cardDetails.map(card => {
            let keys = [
                `${card.set.name}-${card.number}`,
                `${card.set.name.toLowerCase()}-${card.number}`
            ];

            if (card.set.name.includes("Crown Zenith")) {
                keys.push(`Crown Zenith-${card.number}`);
                keys.push(`crown zenith-${card.number}`);
            }
            
            return keys.map(key => [key, card]);
        }).flat()
    );

    for (let card of randomCards) {
        const rawSet = card["Set"].trim();
        const sanitizedSet = normalizeSetName(rawSet);
        const number = card["Card Number"].split("/")[0].trim().replace(/^0+/, "");
        const key = `${sanitizedSet}-${number}`;
        
        const cardData = cardMap.get(key) || cardMap.get(key.toLowerCase());
        
        if (cardData?.images?.small) {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.innerHTML = `
                <img src="${cardData.images.small}" 
                     alt="${card["Product Name"]}" 
                     data-name="${card["Product Name"]}"
                     data-set="${card["Set"]}"
                     data-number="${cardData.number}"
                     class="card-image"
                     loading="lazy">
            `;
            homepageGallery.appendChild(cardElement);
        }
    }
}

async function fetchCardsOver5Dollars() {
    //grab cards from collection
    const cards = await fetch('data/cards.json').then(response => response.json());

    //Filter cards, can't pick promo's or prize cards because of API issues:
    return cards.filter(card =>
        card["Market Price (As of 2025-04-09)"] > 5 &&
        card["Category"] !== "Promo" &&
        card["Category"] !== "Prize"
    );
}

//was told this was good to shuffle array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function openModal(event) {
    const img = event.target;
    const rawSetName = img.dataset.set;
    const number = img.dataset.number;
    
    const normalizedSetName = normalizeSetName(rawSetName);
    const lookupKey = `${normalizedSetName}-${number}`;

    const altKeys = [
        lookupKey,
        `${normalizedSetName.toLowerCase()}-${number}`,
        rawSetName.includes("Crown Zenith") ? `Crown Zenith Galarian Gallery-${number}` : null,
        rawSetName.toLowerCase().includes("sv: 151") ? `151-${number}` : null
    ].filter(Boolean);

    const storedCards = new Map(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    let cardDetails = null;
    for (const key of altKeys) {
        cardDetails = storedCards.get(key);
        if (cardDetails) break;
    }

    if (cardDetails) {
        const collectionData = await fetch('data/cards.json').then(response => response.json());
        const cardInCollection = collectionData.find(card => {
            const cardNumber = card["Card Number"].split("/")[0].trim().replace(/^0+/, "");
            return card["Set"] === rawSetName && cardNumber === number;
        });

        const modalImage = document.getElementById("modal-img");
        const modalTitle = document.getElementById("modal-title");
        const modalSet = document.getElementById("modal-set");
        const modalRarity = document.getElementById("modal-rarity");
        const modalVariant = document.getElementById("modal-variant");
        const modalQuantity = document.getElementById("modal-quantity");
        const modalPrice = document.getElementById("modal-price");

        modalImage.src = cardDetails.images.large;
        modalTitle.textContent = cardDetails.name;
        modalSet.textContent = cardDetails.set.name;
        modalRarity.textContent = cardDetails.rarity;
        modalVariant.textContent = cardInCollection ? cardInCollection["Variance"] : "Unknown";
        modalQuantity.textContent = cardInCollection ? cardInCollection["Quantity"] : "0";

        if (cardDetails.tcgplayer?.prices) {
            let price = null;
            const variant = (cardInCollection?.["Variance"] || "normal").toLowerCase();

            if (variant === "reverse holofoil" && cardDetails.tcgplayer.prices.reverseHolofoil) {
                price = cardDetails.tcgplayer.prices.reverseHolofoil.market;
            } else if (variant === "holofoil" && cardDetails.tcgplayer.prices.holofoil) {
                price = cardDetails.tcgplayer.prices.holofoil.market;
            } else if (cardDetails.tcgplayer.prices.normal) {
                price = cardDetails.tcgplayer.prices.normal.market;
            }

            modalPrice.textContent = price ? `$${price.toFixed(2)}` : 'Price not available';
        } else {
            modalPrice.textContent = 'Price not available';
        }

        const modal = document.getElementById("card-modal");
        modal.style.display = "block";
    }
}

document.addEventListener('click', async function(event) {
    const card = event.target.closest('.card');
    if (card) {
        const img = card.querySelector('img');
        if (img) {
            openModal({ target: img });
        }
    }
});

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("card-modal").style.display = "none";
});

loadHomepageCards();