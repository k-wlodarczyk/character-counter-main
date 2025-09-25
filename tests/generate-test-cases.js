"use strict";

const jsonFile = "test-cases.json";
const wrapper = document.querySelector(".wrapper");
let currentArea = "";

function setHeaderId(headerContent) {
  let headerId = "";
  const headerParts = headerContent.split(" ");
  headerId = headerParts.join("-").toLowerCase();

  return headerId;
}

async function getTestCases() {
  const response = await fetch(jsonFile);
  try {
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const testCases = await response.json();
    for (const [index, testCase] of testCases.entries()) {
      if (testCase.area !== currentArea) {
        currentArea = testCase.area;
        const h2 = document.createElement("h2");
        h2.classList.add("secondary-heading", "test-case-window-heading");
        h2.textContent = currentArea;
        h2.id = setHeaderId(h2.textContent);
        wrapper.appendChild(h2);
      }

      const div = document.createElement("div");
      div.classList.add("test-case-window");
      div.innerHTML = `
      <p><b>Test case ${index + 1}</b>: ${testCase.name}</p>
      <div class="test-case-steps test-case-element">
      <p><b>Steps:</b></p>
      <ul class="steps-list">
      ${testCase.steps
        .map((step) => `<li class="test-case-step">${step}</li>`)
        .join("")}
      </ul>
      </div>
      <div class="test-case-expected test-case-element">
      <p><b>Expected: </b>${testCase.expected}
      </div>`;
      wrapper.appendChild(div);
    }
  } catch (error) {
    console.error(error.message);
  }
}

getTestCases();
