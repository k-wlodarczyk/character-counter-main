// FUNCTIONS
function homePage() {
  return cy.visit("/");
}

function getElement(element) {
  return cy.get(`[data-cy="${element}"]`);
}

describe("Default values", () => {
  beforeEach(() => {
    homePage();
  });

  it("Default values", () => {
    getElement("text-area").should("be.empty");
    getElement("total-chars-counter").should("have.text", "00");
  });
});

describe("Input text area - exclude spaces unchecked", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Total characters are updating on typing text", () => {
    getElement("text-area").type("abc def");
    getElement("total-chars-counter").should("have.text", "07");
  });

  it("Total characters are updating on deleting text", () => {
    getElement("text-area").type("abc def");
    getElement("total-chars-counter").should("have.text", "07");
    getElement("text-area").clear();
    getElement("total-chars-counter").should("have.text", "00");
  });

  it("All kinds of characters are counted", () => {
    getElement("text-area").type("abc DEF 123 !@#");
    getElement("total-chars-counter").should("have.text", "15");
  });

  it("Leading and trailing spaces are counted", () => {
    getElement("text-area").type(" abc ");
    getElement("total-chars-counter").should("have.text", "05");
  });

  it("Multiple consecutive spaces are counted", () => {
    getElement("text-area").type("a b   c");
    getElement("total-chars-counter").should("have.text", "07");
  });

  it("Total characters counter shows leading 0 only if value is less than 10", () => {
    getElement("text-area").type("abcdefghi");
    getElement("total-chars-counter").should("have.text", "09");
    getElement("text-area").type("j");
    getElement("total-chars-counter").should("have.text", "10");
    getElement("text-area").type("{backspace}");
    getElement("total-chars-counter").should("have.text", "09");
  });

  it("New line is counted as a character", () => {
    getElement("text-area").type("abc{enter}def");
    getElement("total-chars-counter").should("have.text", "07");
  });
});

describe("Total characters - exclude spaces checked", () => {
  beforeEach(() => {
    cy.visit("/");
    getElement("checkbox-exclude-spaces").check();
  });

  it('Total characters header has "(no space)" addition', () => {
    getElement("total-chars-description").should(
      "have.text",
      "Total Characters (no space)"
    );
    getElement("checkbox-exclude-spaces").uncheck();
    getElement("total-chars-description").should(
      "have.text",
      "Total Characters"
    );
  });

  it("Leading, inner and trailing spaces are not counted", () => {
    getElement("text-area").type(" abc def ");
    getElement("total-chars-counter").should("have.text", "06");
  });

  it("Total characters are updating after checking and unchecking the checkbox", () => {
    getElement("text-area").type("abc def");
    getElement("total-chars-counter").should("have.text", "06");
    getElement("checkbox-exclude-spaces").uncheck();
    getElement("total-chars-counter").should("have.text", "07");
    getElement("checkbox-exclude-spaces").check();
    getElement("total-chars-counter").should("have.text", "06");
  });

  it("All kinds of characters are counted except spaces", () => {
    getElement("text-area").type("abc DEF 123 !@#");
    getElement("total-chars-counter").should("have.text", "12");
  });
});

describe("Word count", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Word count is updating on typing and deleting text", () => {
    getElement("text-area").type("Hello World");
    getElement("words-counter").should("have.text", "02");
    getElement("text-area").clear();
    getElement("words-counter").should("have.text", "00");
  });

  it("Letters, numbers, asterisks, underscores and polish characters are part of words", () => {
    getElement("text-area").type(
      "abc ABC 123 ąęść ĄĘŚĆ te_xt te*xt 1a two-words word1.word2"
    );
    getElement("words-counter").should("have.text", "12");
  });

  it("Word count counter shows leading 0 only if value is less than 10", () => {
    getElement("text-area").type("1 2 3 4 5 6 7 8 9");
    getElement("words-counter").should("have.text", "09");
    getElement("text-area").type(" 10");
    getElement("words-counter").should("have.text", "10");
    getElement("text-area").type("{backspace}{backspace}");
    getElement("words-counter").should("have.text", "09");
  });

  it("Separators are not counted as words", () => {
    getElement("text-area").type("  ,.!?;:-()[]{}<>/|");
    getElement("words-counter").should("have.text", "00");
  });

  it("Leading and trailing spaces do not create empty words", () => {
    getElement("text-area").type(" abc def ");
    getElement("words-counter").should("have.text", "02");
  });

  it("Underscores are part of words", () => {
    getElement("text-area").type("_abc_ _def_ _");
    getElement("words-counter").should("have.text", "03");
  });

  it("New line is a separator for words", () => {
    getElement("text-area").type("abc{enter}def");
    getElement("words-counter").should("have.text", "02");
  });

  it("Checkbox 'exclude spaces' does not affect word count", () => {
    getElement("text-area").type("abc def");
    getElement("checkbox-exclude-spaces").check();
    getElement("words-counter").should("have.text", "02");
    getElement("checkbox-exclude-spaces").uncheck();
    getElement("words-counter").should("have.text", "02");
  });
});
