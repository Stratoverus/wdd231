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
        "directory.html": "Directory",
        "join.html": "Join",
        "directory.html": "Discover",
    };

    if (pageMap[currentPage]) {
        document.getElementById(pageMap[currentPage]).classList.add("active");
    }
});