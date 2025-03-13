document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".displayStyle button");
    const savedView = localStorage.getItem("viewMode") || "grid";
    const activeButton = document.getElementById(savedView);

    if (activeButton) {
        activeButton.classList.add("active");
    }

    buttons.forEach(button => {
        button.addEventListener("click", function () {

            buttons.forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");
        });
    });
});