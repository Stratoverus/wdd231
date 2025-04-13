const mainnav = document.querySelector('.navigation')
const hambutton = document.querySelector('#menu');
hambutton.addEventListener('click', () => {
	mainnav.classList.toggle('show');
	hambutton.classList.toggle('show');
});

document.addEventListener("DOMContentLoaded", function () {
    let currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "") {
        currentPage = "index.html";
    }

    const pageMap = {
        "index.html": "home",
        "collection.html": "collection",
        "trading-guide.html": "trading-guide",
        "trade.html": "trade",
    };

    if (pageMap[currentPage]) {
        document.getElementById(pageMap[currentPage]).classList.add("active");
    }
});