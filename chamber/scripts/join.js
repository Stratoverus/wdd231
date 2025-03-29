document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".open-modal").forEach(button => {
        button.addEventListener("click", function () {
            const modalId = this.getAttribute("data-modal");
            document.getElementById(modalId).showModal();
        });
    });

    document.querySelectorAll(".close-modal").forEach(button => {
        button.addEventListener("click", function () {
            const modalId = this.getAttribute("data-modal");
            document.getElementById(modalId).close();
        });
    });

    const form = document.getElementById("membershipForm");
    form.addEventListener("submit", function (event) {
        const formData = {
            fname: document.getElementById("fname").value,
            lname: document.getElementById("lname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            oname: document.getElementById("oname").value,
            timestamp: new Date().toLocaleString()
        };

        localStorage.setItem("formData", JSON.stringify(formData));

        window.location.href = "thankyou.html";
    });
    
    form.addEventListener("submit", function () {
        const timestampField = document.getElementById("timestamp");
        timestampField.value = new Date().toISOString();
    });
});