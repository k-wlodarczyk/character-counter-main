Cypress.Commands.add("typeText", (text) => {
  cy.get(`[data-cy="text-area"]`).type(text);
});

Cypress.Commands.add("checkCharsCounter", (text, counterValue) => {
  cy.typeText(text);
  cy.get('[data-cy="total-chars-counter"]').should("have.text", counterValue);
});

Cypress.Commands.add("checkWordsCounter", (text, counterValue) => {
  cy.typeText(text);
  cy.get('[data-cy="words-counter"]').should("have.text", counterValue);
});

Cypress.Commands.add("checkSentencesCounter", (text, counterValue) => {
  cy.typeText(text);
  cy.get(`[data-cy="sentences-counter"]`).should("have.text", counterValue);
});

Cypress.Commands.add("densityPosition", (position, text) => {
  cy.get(".density-calculation").eq(position).should("have.text", text);
});

Cypress.Commands.add("densityPositions", (values) => {
  cy.get(".density-calculation").each((item, index) => {
    cy.wrap(item).should("have.text", values[index]);
  });
});

Cypress.Commands.add("progressBarsFilled", (values) => {
  cy.get(".progression-bar-filled").each((item, index) => {
    cy.wrap(item)
      .should("have.attr", "style")
      .and("contains", `width: ${values[index]}`);
  });
});
