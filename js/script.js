"use strict";

const checkboxSetLimit = document.querySelector("#checkbox-set-limit");
const checkboxExcludeSpaces = document.querySelector(
  "#checkbox-exclude-spaces"
);
const setLimitDiv = document.querySelector(
  ".text-area-details-config-set-limit-div"
);
const textArea = document.querySelector(".text-area");

const totalCharsCounter = document.querySelector("#total-chars-counter");
const totalCharsDescription = document.querySelector(
  "#total-chars-description"
);
const wordsCounter = document.querySelector("#words-counter");

const printCountedValue = function (element, value) {
  element.textContent = value >= 10 ? value : "0" + value;
};

const countCharacters = function () {
  let text = textArea.value;
  if (checkboxExcludeSpaces.checked) {
    text = text.replace(/ /g, "");
  }
  totalCharsCounter.textContent = text.length;
  printCountedValue(totalCharsCounter, text.length);
};

const countWords = function () {
  let text = textArea.value;
  const regex = /(?=[\wĄąĆćĘęŁłŃńÓóŚśŹźŻż])[\wĄąĆćĘęŁłŃńÓóŚśŹźŻż*]+/gu;
  const wordCounter = (text.match(regex) || []).length;
  console.log("Words: ", wordCounter);
  printCountedValue(wordsCounter, wordCounter);
};

const updateTotalCharsDescription = function () {
  const textConsiderSpaces = "Total Characters";
  const textNotConsiderSpaces = textConsiderSpaces + " (no space)";
  totalCharsDescription.textContent = checkboxExcludeSpaces.checked
    ? textNotConsiderSpaces
    : textConsiderSpaces;
};

checkboxSetLimit.addEventListener("change", function () {
  setLimitDiv.classList.toggle("set-limit-checked");
});

checkboxExcludeSpaces.addEventListener("change", function () {
  countCharacters();
  updateTotalCharsDescription();
});

textArea.addEventListener("input", function () {
  countCharacters();
  countWords();
});
