const url = 'https://stratoverus.github.io/wdd231/chamber/data/members.json';

const cards = document.querySelector('#members');

async function getMemberData() {
    const response = await fetch(url);
    const data = await response.json();
    //console.table(data.prophets)
    displayMembers(data.prophets);
}