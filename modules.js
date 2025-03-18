//modules.js
import aCourse from "./course.mjs";

document.querySelector("#enrollStudent").addEventListener("click", function () {
    const sectionNum = document.querySelector("#sectionNumber").value;
    aCourse.changeEnrollment(sectionNum);
});
document.querySelector("#dropStudent").addEventListener("click", function () {
    const sectionNum = document.querySelector("#sectionNumber").value;
    aCourse.changeEnrollment(sectionNum, false);
});

aCourse.init();