const url = 'https://stratoverus.github.io/wdd231/chamber/data/members.json';

const container = document.querySelector('#members');
const gridButton = document.querySelector('#grid');
const listButton = document.querySelector('#list');

async function getMemberData() {
    const response = await fetch(url);
    const data = await response.json();

    //I've heard I need to save this to make it fast for toggling.
    localStorage.setItem("members", JSON.stringify(data.members));

    const savedView = localStorage.getItem("viewMode") || "grid";
    displayMembers(data.members, savedView);
}

getMemberData();

const displayMembers = (members, view) => {
    container.innerHTML = "";
    localStorage.setItem("viewMode", view);

    if (view === "grid"){
        container.classList.add("grid-view");
        container.classList.remove("list-view");

        members.forEach((member) => {
            let card = document.createElement("section");
            let logo = document.createElement("img");
            let address = document.createElement("p");
            let phone = document.createElement("p");
            let website = document.createElement("p");
    
            address.textContent = `${member.address}`;
            phone.textContent = `${member.phone}`;
            website.innerHTML = `<a href="${member.website}" target="_blank">${member.website}</a>`;
    
            logo.setAttribute("src", `images/${member.image}`);
            logo.setAttribute("alt", member.name);
            logo.setAttribute("loading", "lazy");
            logo.setAttribute("width", 200);
            logo.setAttribute("height", 150);
    
            card.appendChild(logo);
            card.appendChild(address);
            card.appendChild(phone);
            card.appendChild(website);
    
            container.appendChild(card);
        });
    } else if (view === "list") {
        container.classList.add("list-view");
        container.classList.remove("grid-view");

        let header = document.createElement("div");

        header.classList.add("list-row", "list-header");
        header.innerHTML = `
            <p><strong>Name</strong></p>
            <p><strong>Address</strong></p>
            <p><strong>Phone</strong></p>
            <p><strong>Website</strong></p>
        `;
        container.appendChild(header);

        members.forEach((member, index) => {
            let row = document.createElement("div");
            row.classList.add("list-row");
            
            if (index % 2 === 0) {
                row.classList.add("striped");
            }

            row.innerHTML = `
                <p>${member.name}</p>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank">${member.website}</a></p>
            `;

            container.appendChild(row);
        });
    }
};

gridButton.addEventListener("click", () => {
    displayMembers(JSON.parse(localStorage.getItem("members")), "grid");
});

listButton.addEventListener("click", () => {
    displayMembers(JSON.parse(localStorage.getItem("members")), "list");
});