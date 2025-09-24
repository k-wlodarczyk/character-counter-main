"use strict";

const checkboxSetLimit = document.querySelector("#checkbox-set-limit");
const setLimitDiv = document.querySelector(
  ".text-area-details-config-set-limit-div"
);
const textArea = document.querySelector(".text-area");

const totalCharsCounter = document.querySelector("#total-chars-counter");

const countCharacters = function (text) {
  totalCharsCounter.textContent = text.length;
};

checkboxSetLimit.addEventListener("change", function () {
  setLimitDiv.classList.toggle("set-limit-checked");
});

textArea.addEventListener("input", function () {
  console.log("Area input!");
  countCharacters(this.value);
});
