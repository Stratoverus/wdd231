document.addEventListener('DOMContentLoaded', () => {
    const tradeData = JSON.parse(localStorage.getItem('tradeRequest'));
    if (tradeData) {
        document.getElementById('tradeSummary').innerHTML = `
            <p><strong>Name:</strong> ${tradeData.name}</p>
            <p><strong>Email:</strong> ${tradeData.email}</p>
            <p><strong>Cards Wanted:</strong></p>
            <ul>
                ${tradeData.cardsWanted.map(card => `<li>${card}</li>`).join('')}
            </ul>
            <p><strong>Card(s) Offered:</strong> ${tradeData.cardOffered}</p>
            <p><strong>Condition:</strong> ${tradeData.condition}</p>
            <p><strong>Comments:</strong> ${tradeData.comments}</p>
            <p><strong>Submitted:</strong> ${tradeData.date}</p>
        `;
        localStorage.removeItem('tradeRequest');
    }
});