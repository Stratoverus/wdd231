window.addEventListener('load', function() {
    const modal = document.getElementById("modal");
    const lastVisit = localStorage.getItem("lastVisit");
    const currentTime = new Date().getTime();

    if (!lastVisit) {
        message = "Welcome! Please let us know if you have any questions!"
    } else {
        const lastVisitTime = parseInt(lastVisit, 10);
        const differenceInDays = Math.floor((currentTime - lastVisitTime) / (1000 * 60 * 60 * 24));

        if (differenceInDays === 0) {
            message = "Back so soon? Awesome! Let us know if you need anything."
        } else if (differenceInDays === 1) {
            message = "You last visited 1 day ago. Let us know if you have any questions."
        } else {
            message = `It's been a while! You last visited ${differenceInDays} days ago. As always, let us know if you have any questions.`
        }
    }

    modal.querySelector(".modalTitle").textContent = "Welcome!";
    modal.querySelector(".modalContent").textContent = message;

    modal.showModal();

    localStorage.setItem("lastVisit", currentTime);
});