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
  // console.log(sentencesCounter);
  return sentencesCounter;
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
  printValue(totalCharsCounter, countCharacters(textArea.value));
  updateTotalCharsDescription();
});

textArea.addEventListener("input", function () {
  let countedChars = countCharacters(textArea.value);
  let countedWords = countWords(textArea.value);
  let countedSentences = countSentences(textArea.value);
  printCountedValues(countedChars, countedWords, countedSentences);
});
