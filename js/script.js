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
const sentencesCounter = document.querySelector("#sentences-counter");

const letterDensityArea = document.querySelector(".generated-letter-density");
const letterDensityObject = document.querySelector(".letter-density-object");

const printCountedValues = function (chars, words, sentences) {
  printValue(totalCharsCounter, chars);
  printValue(wordsCounter, words);
  printValue(sentencesCounter, sentences);
};

const printValue = function (element, value) {
  element.textContent = value >= 10 ? value : "0" + value;
};

const countCharacters = function (text) {
  if (checkboxExcludeSpaces.checked) {
    text = text.replace(/ /g, "");
  }

  return text.length;
};

const countWords = function (text) {
  const regex = /(?=[\wĄąĆćĘęŁłŃńÓóŚśŹźŻż])[\wĄąĆćĘęŁłŃńÓóŚśŹźŻż*]+/gu;
  const wordCounter = (text.match(regex) || []).length;
  return wordCounter;
};

const countSentences = function (text) {
  text += "."; // if last sentence is not ended with dot
  const regex = /[^.!?…]+(?:\.\.\.|…|[.!?])/g;
  const parts = text.match(regex) || [];
  let sentencesCounter = parts.length;

  for (const part of parts) {
    if (!countWords(part)) sentencesCounter--;
  }

  return sentencesCounter;
};

const updateTotalCharsDescription = function () {
  const textConsiderSpaces = "Total Characters";
  const textNotConsiderSpaces = textConsiderSpaces + " (no space)";
  totalCharsDescription.textContent = checkboxExcludeSpaces.checked
    ? textNotConsiderSpaces
    : textConsiderSpaces;
};

const checkIfAlreadyExists = function (letter) {
  for (const child of letterDensityArea.children) {
    // console.log(letter, child.id);
    if (child.id === letter) return true;
  }
  return false;
};

const generateWholeDensityObject = function (
  density,
  densityPercentage,
  element
) {
  const densityObject = document.createElement("div");
  const letter = document.createElement("p");
  letter.classList.add("letter", "density-calculation");
  densityObject.classList.add("generated-letter-density-object");
  letter.textContent = element;
  densityObject.id = element.toLowerCase();
  const progressBar = document.createElement("div");
  progressBar.classList.add("progression-bar");
  const progressBarFilled = document.createElement("div");
  progressBarFilled.classList.add("progression-bar-filled");
  progressBarFilled.style.width = `${densityPercentage[element]}%`;
  progressBar.appendChild(progressBarFilled);
  const calculatedDensity = document.createElement("p");
  calculatedDensity.classList.add("calculated-density", "density-calculation");
  calculatedDensity.textContent = `${density[element]} (${densityPercentage[element]}%)`;
  densityObject.appendChild(letter);
  densityObject.appendChild(progressBar);
  densityObject.appendChild(calculatedDensity);
  letterDensityArea.appendChild(densityObject);
};

const updateDensityObject = function (density, densityPercentage, element) {
  const densityObject = letterDensityArea.querySelector(
    `#${element.toLowerCase()}`
  );
  const progressBarFilled = densityObject.querySelector(
    ".progression-bar-filled"
  );
  progressBarFilled.style.width = `${densityPercentage[element]}%`;

  const calculatedDensity = densityObject.querySelector(".calculated-density");
  calculatedDensity.textContent = `${density[element]} (${densityPercentage[element]}%)`;
};

const deleteEmptyDensity = function (density, densityPercentage) {
  const letters = Object.keys(density);
  // console.log(letterDensityArea.children);
  for (const density of letterDensityArea.children) {
    if (!letters.includes(density.id.toUpperCase())) {
      density.remove();
    }
  }
};

const generateLetterDensity = function (density, densityPercentage) {
  for (const [element, value] of Object.entries(density)) {
    if (checkIfAlreadyExists(element.toLowerCase())) {
      updateDensityObject(density, densityPercentage, element);
    } else {
      generateWholeDensityObject(density, densityPercentage, element);
    }
  }

  deleteEmptyDensity(density, densityPercentage);
};

const calculateLetterDensity = function (text) {
  const textToUpper = text.toUpperCase();
  let sumOfChars = 0;
  let density = {};
  const densityPercentage = {};

  for (const letter of textToUpper) {
    if (!letter.match(/[\p{Letter}\p{Mark}]+/gu)) continue;
    density[letter] = (density[letter] || 0) + 1;
    sumOfChars++;
  }
  // console.log(density);

  const lettersArray = Object.keys(density).map((key) => [key, density[key]]);
  density = {};

  lettersArray.sort((a, b) => {
    return b[1] - a[1];
  });

  for (const [letter, value] of lettersArray) {
    density[letter] = value;
  }

  for (const [element, value] of Object.entries(density)) {
    const densityValue = (value / sumOfChars) * 100;
    const densityValueTwoDecimals = (
      Math.round(densityValue * 100) / 100
    ).toFixed(2);
    densityPercentage[element] = densityValueTwoDecimals;
  }

  while (letterDensityArea.firstChild) {
    letterDensityArea.removeChild(letterDensityArea.firstChild);
  }

  generateLetterDensity(density, densityPercentage);
  // console.log(density, densityPercentage);
};

checkboxSetLimit.addEventListener("change", function () {
  setLimitDiv.classList.toggle("set-limit-checked");
});

checkboxExcludeSpaces.addEventListener("change", function () {
  printValue(totalCharsCounter, countCharacters(textArea.value));
  updateTotalCharsDescription();
});

textArea.addEventListener("input", function () {
  const countedChars = countCharacters(textArea.value);
  const countedWords = countWords(textArea.value);
  const countedSentences = countSentences(textArea.value);
  calculateLetterDensity(textArea.value);
  printCountedValues(countedChars, countedWords, countedSentences);
});
