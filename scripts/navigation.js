const mainnav = document.querySelector('.navigation')
const hambutton = document.querySelector('#menu');
hambutton.addEventListener('click', () => {
	mainnav.classList.toggle('show');
	hambutton.classList.toggle('show');
});

document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();

    const pageMap = {
        "index.html": "home",
        "chamber-placeholder.html": "chamber",
        "github-placeholder.html": "github",
    };

    if (pageMap[currentPage]) {
        document.getElementById(pageMap[currentPage]).classList.add("active");
    }
});