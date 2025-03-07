window.onload = function() {
    //current year area
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
    
    //Last Modified area
    const lastModified = document.lastModified;
    document.getElementById('lastModified').textContent = lastModified;
};