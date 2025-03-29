document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    document.getElementById("fname").textContent = params.get("fname") || "Not provided";
    document.getElementById("lname").textContent = params.get("lname") || "Not provided";
    document.getElementById("email").textContent = params.get("email") || "Not provided";
    document.getElementById("phone").textContent = params.get("phone") || "Not provided";
    document.getElementById("oname").textContent = params.get("oname") || "Not provided";

    const membershipLevels = {
        "np": "Non-Profit Membership (Free)",
        "bronze": "Bronze Membership",
        "silver": "Silver Membership",
        "gold": "Gold Membership"
    };

    const membershipValue = params.get("membership");
    document.getElementById("membership").textContent = membershipLevels[membershipValue];

    const timestamp = params.get("timestamp");
    document.getElementById("timestamp").textContent = timestamp ? new Date(timestamp).toLocaleString() : "N/A";
});