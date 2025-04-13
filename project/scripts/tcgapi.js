//API variables
const API_URL = "https://api.pokemontcg.io/v2/cards";
const API_KEY = "b9e7ce0c-fd1a-4e86-8b53-1325fb1f90e6";

export async function fetchMultipleCardDetails(cards) {
    const queries = cards.map(card => {
        let rawSet = card["Set"].trim();
        
        if (/^sv:\s*/i.test(rawSet)) {
            rawSet = rawSet.replace(/^sv:\s*/i, "").trim();
        }
        if (rawSet.includes(":")) {
            rawSet = rawSet.split(":")[0].trim();
        }
        if (rawSet.includes("Scarlet")) {
            rawSet = rawSet.replace("Base Set", "").trim();
        }

        const number = card["Card Number"].split("/")[0].trim().replace(/^0+/, "");
        return `(set.name:"${rawSet}" number:${number})`;
    });

    const baseQuery = queries.join(' or ');
    const requestUrl = `${API_URL}?q=${encodeURIComponent(baseQuery)}`;

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
        return data.data || [];

    } catch (err) {
        console.error('API Error:', err);
        return [];
    }
}