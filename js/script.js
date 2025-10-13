"use strict";

let colorScheme = localStorage.getItem("colorScheme");
const modeSwitchBtn = document.querySelector(".mode-switch-btn");

const textArea = document.querySelector(".text-area");

const checkboxSetLimit = document.querySelector("#checkbox-set-limit");
const checkboxExcludeSpaces = document.querySelector(
  "#checkbox-exclude-spaces"
);
const setLimitDiv = document.querySelector(
  ".text-area-details-config-set-limit-div"
);
const charsLimitField = document.querySelector("#character-limit-field");
const errorMessage = document.querySelector(".error-message");
const errorMessageContent = document.querySelector(".message-content");

const totalCharsCounter = document.querySelector("#total-chars-counter");
const totalCharsDescription = document.querySelector(
  "#total-chars-description"
);
const wordsCounter = document.querySelector("#words-counter");
const sentencesCounter = document.querySelector("#sentences-counter");

const letterDensityArea = document.querySelector(".generated-letter-density");
const letterDensityObject = document.querySelector(".letter-density-object");
const emptyDensityParagraph = document.querySelector(
  ".empty-density-paragraph"
);

const MAX_DENSITY_OBJECTS_WITHOUT_SWITCH = 5;
const moreLessSwitch = document.querySelector(".more-less-switch");

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
  const regex = /[\p{L}\d*_]+/gu;
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
    if (child.id === letter) return true;
  }
  return false;
};

const renderLetter = function (letterDensity) {
  const letter = document.createElement("p");
  letter.classList.add("letter", "density-calculation");

  letter.textContent = letterDensity;

  return letter;
};

const renderProgressBar = function (occurenciesPercentage) {
  const progressBar = document.createElement("div");
  progressBar.classList.add("progression-bar");
  const progressBarFilled = document.createElement("div");
  progressBarFilled.classList.add("progression-bar-filled");
  progressBarFilled.style.width = `${occurenciesPercentage}%`;
  progressBar.appendChild(progressBarFilled);
  return progressBar;
};

const renderLetterOccurencies = function (occurencies, occurenciesPercentage) {
  const letterOccurencies = document.createElement("p");
  letterOccurencies.classList.add("calculated-density", "density-calculation");
  letterOccurencies.textContent = `${occurencies} (${occurenciesPercentage}%)`;

  return letterOccurencies;
};

const renderDensity = function (
  letterDensity,
  occurencies,
  occurenciesPercentage
) {
  const densityObject = document.createElement("div");
  densityObject.classList.add("generated-letter-density-object");
  densityObject.id = letterDensity.toLowerCase();
  const letter = renderLetter(letterDensity);
  const progressBar = renderProgressBar(occurenciesPercentage);
  const letterOccurencies = renderLetterOccurencies(
    occurencies,
    occurenciesPercentage
  );

  densityObject.append(letter, progressBar, letterOccurencies);
  letterDensityArea.appendChild(densityObject);
};

const clearLetterDensity = function () {
  for (const density of letterDensityArea.querySelectorAll(
    ".generated-letter-density-object"
  )) {
    density.remove();
  }
};

const renderFullDensity = function (density, densityPercentage) {
  for (const [element, value] of Object.entries(density)) {
    renderDensity(element, value, densityPercentage[element]);
  }
};

const renderTopDensity = function (density, densityPercentage) {
  let counter = 0;
  for (const [element, value] of Object.entries(density)) {
    if (counter === MAX_DENSITY_OBJECTS_WITHOUT_SWITCH) return;
    renderDensity(element, value, densityPercentage[element]);
    counter++;
  }
};

const generateLetterDensity = function (density, densityPercentage) {
  clearLetterDensity();

  if (letterDensityArea.classList.contains("full")) {
    renderFullDensity(density, densityPercentage);
    moreLessSwitch.classList.add("show-less");
    moreLessSwitch.classList.remove("show-more");
  } else {
    renderTopDensity(density, densityPercentage);
    moreLessSwitch.classList.remove("show-less");
    moreLessSwitch.classList.add("show-more");
  }
};

const setDensity = function (text, regex) {
  const density = {};
  let sumOfChars = 0;

  for (const letter of text) {
    if (!letter.match(regex)) continue;
    density[letter] = (density[letter] || 0) + 1;
    sumOfChars++;
  }

  return density;
};

const setSortedDensity = function (density) {
  const sortedDensity = {};
  const lettersArray = Object.keys(density).map((key) => [key, density[key]]);

  lettersArray.sort((a, b) => {
    return b[1] - a[1];
  });

  for (const [letter, value] of lettersArray) {
    sortedDensity[letter] = value;
  }

  return sortedDensity;
};

const setDensityPercentage = function (density, sumOfChars) {
  const densityPercentage = {};

  for (const [element, value] of Object.entries(density)) {
    const densityValue = (value / sumOfChars) * 100;
    const densityValueTwoDecimals = (
      Math.round(densityValue * 100) / 100
    ).toFixed(2);
    densityPercentage[element] = densityValueTwoDecimals;
  }

  return densityPercentage;
};

const printMoreLessSwitch = function (densityLength) {
  moreLessSwitch.style.display =
    densityLength > MAX_DENSITY_OBJECTS_WITHOUT_SWITCH ? "block" : "none";
};

const calculateLetterDensity = function (text) {
  const textToUpper = text.toUpperCase();
  const regex = /[\p{Letter}\p{Mark}]+/gu;
  const regexFinds = text?.match(regex)?.join("");
  const sumOfChars = regexFinds?.length;

  const density = setDensity(textToUpper, regex);
  const sortedDensity = setSortedDensity(density);
  const densityPercentage = setDensityPercentage(sortedDensity, sumOfChars);

  const densityLength = Object.keys(density).length;
  printMoreLessSwitch(densityLength);
  generateLetterDensity(sortedDensity, densityPercentage);
};

const renderCharsLimitError = function (charsLimit) {
  textArea.classList.add("text-area-error");
  console.log(
    `error, textArea chars: ${textArea.value.length}, limit: ${charsLimit}`
  );
  errorMessageContent.textContent = `Limit reached! Your text exceeds ${charsLimit} characters.`;
};

const removeCharsLimitError = function () {
  textArea.classList.remove("text-area-error");
};

const checkTextAreaLimitChars = function () {
  const chars = countCharacters(textArea.value);
  const charsLimit = Number(charsLimitField.value);
  if (charsLimit && chars > charsLimit) {
    renderCharsLimitError(charsLimit);
  } else {
    removeCharsLimitError();
  }
};

const enableDarkMode = function () {
  document.body.classList.add("darkmode");
  localStorage.setItem("colorScheme", "dark");
};

const disableDarkMode = function () {
  document.body.classList.remove("darkmode");
  localStorage.setItem("colorScheme", "light");
};

const setModeOnAgentScheme = function () {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.body.classList.add("darkmode");
  } else {
    document.body.classList.remove("darkmode");
  }
};

window.addEventListener("load", function () {
  colorScheme = localStorage.getItem("colorScheme");
  if (!colorScheme) {
    setModeOnAgentScheme(window);
  } else {
    colorScheme === "dark" ? enableDarkMode() : disableDarkMode();
  }
});

modeSwitchBtn.addEventListener("click", function () {
  document.body.classList.contains("darkmode")
    ? disableDarkMode()
    : enableDarkMode();
});

textArea.addEventListener("input", function () {
  const countedChars = countCharacters(textArea.value);
  const countedWords = countWords(textArea.value);
  const countedSentences = countSentences(textArea.value);
  letterDensityArea.classList.toggle("empty-density", !textArea.value);
  calculateLetterDensity(textArea.value);
  checkTextAreaLimitChars();
  printCountedValues(countedChars, countedWords, countedSentences);
});

checkboxExcludeSpaces.addEventListener("change", function () {
  printValue(totalCharsCounter, countCharacters(textArea.value));
  updateTotalCharsDescription();
  checkTextAreaLimitChars();
});

checkboxSetLimit.addEventListener("change", function () {
  setLimitDiv.classList.toggle("set-limit-checked");
  if (!setLimitDiv.classList.contains("set-limit-checked")) {
    charsLimitField.value = null;
    removeCharsLimitError();
  }
});

charsLimitField.addEventListener("input", function () {
  charsLimitField.value = charsLimitField.value.replace(/\D/g, "");

  checkTextAreaLimitChars(charsLimitField.value);
});

moreLessSwitch.addEventListener("click", function (event) {
  const isButton = event.target.closest("button");
  if (!isButton) {
    return;
  }
  letterDensityArea.classList.toggle("full");
  calculateLetterDensity(textArea.value);
});
