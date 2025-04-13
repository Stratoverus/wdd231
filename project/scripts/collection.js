//Collections page JS and logic
import { fetchMultipleCardDetails } from './tcgapi.js';

const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');
const collectionGallery = document.querySelector('.collection-gallery');
const CARDS_PER_PAGE = 18;
let currentCards = [];
let currentPage = 0;
let isLoading = false;
let filteredAndSortedCards = [];
const STORAGE_KEY = 'pokemonCardDetails';

function normalizeSetName(setName) {
    let name = setName.trim();
    
    if (/^sv:\s*151/i.test(name)) {
        return "151";
    }
    
    if (/scarlet\s*&\s*violet(?:\s*base\s*set)?/i.test(name)) {
        return "Scarlet & Violet";
    }

    if (/crown zenith:?\s*(?:galarian gallery)?/i.test(name)) {
        return "Crown Zenith";
    }
    
    if (name.includes(":")) {
        name = name.split(":")[0].trim();
    }
    
    return name;
}

async function loadCollection() {
    const allCards = await fetch('data/cards.json').then(response => response.json());
    
    currentCards = allCards.filter(card => {
        const loweredSet = card["Set"].toLowerCase().trim();
        const isPromoOrPrize = 
            card["Category"] === "Promo" || 
            card["Category"] === "Prize" ||
            loweredSet.includes("promo") ||
            loweredSet.includes("prize");
        
        const isExcludedSet = 
            loweredSet.includes("jumbo") ||
            loweredSet.includes("miscellaneous") ||
            loweredSet.includes("trick") ||
            loweredSet.includes("exclusives");

        return !isPromoOrPrize && !isExcludedSet;
    });
    
    updateDisplay();

    filterSelect.addEventListener('change', updateDisplay);
    sortSelect.addEventListener('change', updateDisplay);
    window.addEventListener('scroll', handleScroll);
}

function updateDisplay() {
    let filteredCards = filterCards(currentCards, filterSelect.value);
    let sortedCards = sortCards(filteredCards, sortSelect.value);
    displayCards(sortedCards);
}

function filterCards(cards, filterType) {
    switch(filterType) {
        case 'duplicates':
            return cards.filter(card => parseInt(card["Quantity"]) > 1);
        case 'expensive':
            return cards.filter(card => card["Market Price (As of 2025-04-09)"] > 5);
        default:
            return cards;
    }
}

function sortCards(cards, sortType) {
    switch(sortType) {
        case 'price-high':
            return [...cards].sort((a, b) => 
                b["Market Price (As of 2025-04-09)"] - a["Market Price (As of 2025-04-09)"]);
        case 'price-low':
            return [...cards].sort((a, b) => 
                a["Market Price (As of 2025-04-09)"] - b["Market Price (As of 2025-04-09)"]);
        case 'set-name':
            return [...cards].sort((a, b) => a["Set"].localeCompare(b["Set"]));
        case 'name':
            return [...cards].sort((a, b) => a["Product Name"].localeCompare(b["Product Name"]));
        default:
            return cards;
    }
}

async function displayCards(cards, append = false) {
    if (!append) {
        collectionGallery.innerHTML = '';
        currentPage = 0;
        //Filter out promos/prize cards before setting filteredAndSortedCards
        filteredAndSortedCards = cards.filter(card => {
            const isPromoOrPrize = 
                card["Category"] === "Promo" || 
                card["Category"] === "Prize" ||
                card["Set"].toLowerCase().includes("promo") ||
                card["Set"].toLowerCase().includes("prize");
            return !isPromoOrPrize;
        });
    }

    isLoading = true;
    const startIdx = currentPage * CARDS_PER_PAGE;
    const endIdx = Math.min(startIdx + CARDS_PER_PAGE, filteredAndSortedCards.length);
    const pageCards = filteredAndSortedCards.slice(startIdx, endIdx);

    if (pageCards.length > 0) {
        const cardDetails = await fetchMultipleCardDetails(pageCards);
        
        const storedCards = new Map(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
        cardDetails.forEach(card => {
            const storageKey = `${card.set.name}-${card.number}`;
            storedCards.set(storageKey, card);
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(storedCards.entries())));

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
                
                if (card.set.name.includes("Scarlet & Violet")) {
                    keys.push(`Scarlet & Violet-${card.number}`);
                    keys.push(`scarlet & violet-${card.number}`);
                }
                
                return keys.map(key => [key, card]);
            }).flat()
        );

        for (let card of pageCards) {
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
                         class="card-image">
                `;
                collectionGallery.appendChild(cardElement);
            }
        }

        currentPage++;
        isLoading = false;
    }
}

async function loadMoreCards() {
    const remainingCards = filteredAndSortedCards.length - (currentPage * CARDS_PER_PAGE);
    if (remainingCards > 0) {
        await displayCards(filteredAndSortedCards, true);
    }
}

function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.offsetHeight;
    const loadMoreThreshold = 200;

    if (!isLoading && (scrollPosition + loadMoreThreshold >= pageHeight)) {
        loadMoreCards();
    }
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

loadCollection();