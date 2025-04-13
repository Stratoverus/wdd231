let cards = [];
let selectedCards = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('data/cards.json');
    cards = await response.json();
    
    const searchInput = document.getElementById('cardSearch');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        const matches = cards.filter(card => 
            card['Product Name'].toLowerCase().includes(searchTerm)
        ).slice(0, 5);
        
        searchResults.innerHTML = matches.map(card => {
            let displayName = card['Product Name'];
            let variance = card['Variance'];
            
            let displayText = variance && variance !== 'Normal' 
                ? `${displayName} (${variance}) - ${card['Set']}`
                : `${displayName} - ${card['Set']}`;
            
            let cardData = {
                name: displayName,
                variance: variance !== 'Normal' ? variance : ''
            };
            
            return `
                <div class="search-result" onclick='selectCard(${JSON.stringify(JSON.stringify(cardData))})'>
                    ${displayText}
                </div>
            `;
        }).join('');
    });
});

function selectCard(cardDataString) {
    const cardData = JSON.parse(cardDataString);
    const displayName = cardData.variance 
        ? `${cardData.name} (${cardData.variance})`
        : cardData.name;
    
    selectedCards.add(displayName);
    updateSelectedCardsDisplay();
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('cardSearch').value = '';
}

function removeCard(cardName) {
    selectedCards.delete(cardName);
    updateSelectedCardsDisplay();
}

function updateSelectedCardsDisplay() {
    const container = document.getElementById('selectedCards');
    container.innerHTML = Array.from(selectedCards).map(card => `
        <div class="card-tag">
            ${card}
            <button type="button" onclick="removeCard('${card}')" class="remove-card" aria-label="Remove ${card}">×</button>
        </div>
    `).join('');
}

function handleTradeSubmit(event) {
    event.preventDefault();
    
    const tradeData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        cardsWanted: Array.from(selectedCards),
        cardOffered: document.getElementById('cardOffered').value,
        condition: document.getElementById('condition').value,
        comments: document.getElementById('comments').value,
        date: new Date().toLocaleString()
    };
    
    localStorage.setItem('tradeRequest', JSON.stringify(tradeData));
    window.location.href = 'thankyou.html';
}