// FUNCTIONS
function homePage() {
  return cy.visit("/");
}

// GETTING ELEMENTS
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

describe("Total characters - exclude spaces unchecked", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Total characters are updating on typing text", () => {
    cy.checkCharsCounter("abc def", "07");
  });

  it("Total characters are updating on deleting text", () => {
    cy.checkCharsCounter("abc def", "07");
    getElement("text-area").clear();
    getElement("total-chars-counter").should("have.text", "00");
  });

  it("All kinds of characters are counted", () => {
    cy.checkCharsCounter("abc DEF 123 !@#", "15");
  });

  it("Polish characters are counted", () => {
    cy.checkCharsCounter("ąćęłńóśźżĄĆĘŁŃÓŚŹŻ", "18");
  });

  it("Leading and trailing spaces are counted", () => {
    cy.checkCharsCounter(" abc ", "05");
  });

  it("Multiple consecutive spaces are counted", () => {
    cy.checkCharsCounter("a b   c", "07");
  });

  it("Total characters counter shows leading 0 only if value is less than 10", () => {
    cy.checkCharsCounter("abcdefghi", "09");
    cy.checkCharsCounter("j", "10");
    cy.checkCharsCounter("{backspace}", "09");
  });

  it("New line is counted as a character", () => {
    cy.checkCharsCounter("abc{enter}def", "07");
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
    cy.checkCharsCounter(" abc def ", "06");
  });

  it("Total characters are updating after checking and unchecking the checkbox", () => {
    cy.checkCharsCounter("abc def", "06");
    getElement("checkbox-exclude-spaces").uncheck();
    getElement("total-chars-counter").should("have.text", "07");
    getElement("checkbox-exclude-spaces").check();
    getElement("total-chars-counter").should("have.text", "06");
  });

  it("All kinds of characters are counted except spaces", () => {
    cy.checkCharsCounter("abc DEF 123 !@#", "12");
  });
});

describe("Word count", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Word count is updating on typing and deleting text", () => {
    cy.checkWordsCounter("Hello world", "02");
    getElement("text-area").clear();
    getElement("words-counter").should("have.text", "00");
  });

  it("Letters, numbers, asterisks, underscores and polish characters are part of words", () => {
    cy.checkWordsCounter(
      "abc ABC 123 ąęść ĄĘŚĆ te_xt te*xt 1a two-words word1.word2",
      "12"
    );
  });

  it("Word count counter shows leading 0 only if value is less than 10", () => {
    cy.checkWordsCounter("1 2 3 4 5 6 7 8 9", "09");
    cy.checkWordsCounter(" 10", "10");
    cy.checkWordsCounter("{backspace}{backspace}", "09");
  });

  it("Separators are not counted as words", () => {
    cy.checkWordsCounter("  ,.!?;:-()[]{}<>/|", "00");
  });

  it("Leading and trailing spaces do not create empty words", () => {
    cy.checkWordsCounter(" abc def ", "02");
  });

  it("Underscores are part of words", () => {
    cy.checkWordsCounter("_abc_ _def_ _", "03");
  });

  it("New line is a separator for words", () => {
    cy.checkWordsCounter("abc{enter}def", "02");
  });

  it("Checkbox 'exclude spaces' does not affect word count", () => {
    cy.checkWordsCounter("abc def", "02");
    getElement("checkbox-exclude-spaces").check();
    getElement("checkbox-exclude-spaces").uncheck();
    getElement("words-counter").should("have.text", "02");
  });
});

describe("Sentence count", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Sentence count is updating on typing and deleting text", () => {
    cy.checkSentencesCounter("Hello World. This is a test.", "02");
    getElement("text-area").clear();
    getElement("sentences-counter").should("have.text", "00");
  });

  it("Sentences are separated by characters: . > ? ...", () => {
    cy.checkSentencesCounter(
      "This is sentence one. This is sentence two! Is this sentence three? This is not the end... Or is it",
      "05"
    );
  });

  it("Sentence counter shows leading 0 only if value is less than 10", () => {
    cy.checkSentencesCounter("1. 2. 3. 4. 5. 6. 7. 8. 9.", "09");
    cy.checkSentencesCounter("10.", "10");
    cy.checkSentencesCounter("{backspace}{backspace}{backspace}", "09");
  });

  it("Sentence is counted only if has at least one word", () => {
    cy.checkSentencesCounter(
      'Sentence 1. ! Sentence 2?Sentence 3... Sentence 4# and still sentence 4".. . ?()sentence 5.',
      "05"
    );
  });

  it("Last sentence does not need to end with a separator to be counted", () => {
    cy.checkSentencesCounter(
      "This is sentence one. This is sentence two! This is sentence three",
      "03"
    );
    getElement("text-area").clear();
    cy.checkSentencesCounter("This is sentence one", "01");
  });

  it("Sentence can have multiple lines", () => {
    cy.checkSentencesCounter(
      "This is sentence one{enter}still sentence one.{enter}This is sentence two.",
      "02"
    );
  });

  it("Sentence does not need to have letters to be counted", () => {
    cy.checkSentencesCounter("12345! _. Ąć1#? (){}[]", "03");
  });
});

describe("Character limit", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("After checking checkbox 'Set character limit', additional input to set the limit appears", () => {
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").should("be.visible").and("be.empty");
  });

  it("Character limit input accepts only numbers", () => {
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").type("-10.,5 abc");
    getElement("chars-limit-field").should("have.value", "105");
  });

  it("Character limit input is cleared and disappears when unchecking the checkbox", () => {
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").type("10");
    getElement("checkbox-set-limit").uncheck();
    getElement("chars-limit-field").should("not.be.visible");
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").should("be.visible").and("be.empty");
  });

  it("Exceeding the character limit shows error state in text area and error message", () => {
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").type("5");
    cy.typeText("abcdef");
    cy.shouldBeErrorMessageWithChars(5);
  });

  it("Error state is removed when text is decreased to be within the limit", () => {
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").type("5");
    cy.typeText("abcdef");
    cy.typeText("{backspace}");
    getElement("message-content").should("not.be.visible");
  });

  it("Unchecking the checkbox removes the limit and error state", () => {
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").type("5");
    cy.typeText("abcdef");
    getElement("checkbox-set-limit").uncheck();
    getElement("message-content").should("not.be.visible");
  });

  it("Change limit value updates the error state", () => {
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").type("5");
    cy.typeText("abcdef");
    cy.shouldBeErrorMessageWithChars(5);
    getElement("chars-limit-field").clear().type("6");
    getElement("message-content").should("not.be.visible");
    getElement("chars-limit-field").clear().type("4");
    cy.shouldBeErrorMessageWithChars(4);
  });

  it("Character limit checks limit when text is already typed", () => {
    cy.typeText("abcdef");
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").type("5");
    cy.shouldBeErrorMessageWithChars(5);
  });

  it("Character limit concerns 'Exclude spaces' checkbox state", () => {
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").type("6");
    cy.typeText("abc def");
    cy.shouldBeErrorMessageWithChars(6);
    getElement("checkbox-exclude-spaces").check();
    getElement("message-content").should("not.be.visible");
    getElement("checkbox-exclude-spaces").uncheck();
    cy.shouldBeErrorMessageWithChars(6);
  });

  it("Limit input must be a positive integer greater than zero", () => {
    getElement("checkbox-set-limit").check();
    getElement("chars-limit-field").type("0");
    cy.typeText("abc");
    getElement("message-content").should("not.be.visible");
    getElement("chars-limit-field").clear();
    getElement("message-content").should("not.be.visible");
  });
});

describe("Letter density", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Letter density appears after typing letters", () => {
    cy.typeText("12345! _");
    cy.get(".generated-letter-density-object").should("not.exist");
    cy.typeText("a");
    cy.get(".generated-letter-density-object").should("exist");
  });

  it("After letter density appears, message 'No characters found. Start typing to see letter denisty' diappears", () => {
    getElement("empty-density").should("be.visible");
    getElement("empty-density").should(
      "have.text",
      "No characters found. Start typing to see letter density."
    );
  });

  it("Letter density includes only letters", () => {
    cy.typeText("abaA 1_23 !@#.");
    cy.densityPositions(["A", "3 (75.00%)", "B", "1 (25.00%)"]);
  });

  it("Letter density is case insensitive", () => {
    cy.typeText("aA Bb");
    cy.densityPositions(["A", "2 (50.00%)", "B", "2 (50.00%)"]);
  });

  it("Letter density concerns polish characters", () => {
    cy.typeText("ęśąćź ĘŚĄĆŹ");
    cy.densityPositions([
      "Ę",
      "2 (20.00%)",
      "Ś",
      "2 (20.00%)",
      "Ą",
      "2 (20.00%)",
      "Ć",
      "2 (20.00%)",
      "Ź",
      "2 (20.00%)",
    ]);
  });

  it("Letter density is sorted by number of occurrences (descending). If two letters have the same number of occurrences, first is the one that appeared first in the text", () => {
    cy.typeText("CCbAa");
    cy.densityPositions([
      "C",
      "2 (40.00%)",
      "A",
      "2 (40.00%)",
      "B",
      "1 (20.00%)",
    ]);
    cy.typeText("A");
    cy.densityPositions([
      "A",
      "3 (50.00%)",
      "C",
      "2 (33.33%)",
      "B",
      "1 (16.67%)",
    ]);
    cy.typeText("C");
    cy.densityPositions([
      "C",
      "3 (42.86%)",
      "A",
      "3 (42.86%)",
      "B",
      "1 (14.29%)",
    ]);
    cy.typeText("CA");
    cy.densityPositions([
      "C",
      "4 (44.44%)",
      "A",
      "4 (44.44%)",
      "B",
      "1 (11.11%)",
    ]);
  });

  it("Percentage is calculated as number of occurrences divided by total number of letters with two decimal places. Only letters are counted, other characters are ignored", () => {
    cy.typeText("aA1 Bb_#{enter}CC?!");
    cy.densityPositions([
      "A",
      "2 (33.33%)",
      "B",
      "2 (33.33%)",
      "C",
      "2 (33.33%)",
    ]);
  });

  it("Density for a letter is removed when there are no occurrences of that letter in the text", () => {
    cy.typeText("aabbcc");
    cy.densityPositions([
      "A",
      "2 (33.33%)",
      "B",
      "2 (33.33%)",
      "C",
      "2 (33.33%)",
    ]);
    cy.typeText("{moveToStart}{rightArrow}{rightArrow}{backspace}{backspace}");
    cy.densityPositions(["B", "2 (50.00%)", "C", "2 (50.00%)"]);

    cy.get(".generated-letter-density")
      .children(".generated-letter-density-object")
      .should("have.length", 2);
  });

  it("Progress bar has width proportional to percentage value", () => {
    cy.typeText("ab");
    cy.get(".progression-bar-filled").should("have.length", 2);
    cy.progressBarsFilled(["50%", "50%"]);

    cy.typeText("{backspace}");
    cy.get(".progression-bar-filled").should("have.length", 1);
    cy.progressBarsFilled(["100%"]);

    cy.typeText("cccc");
    cy.get(".progression-bar-filled").should("have.length", 2);
    cy.progressBarsFilled(["80%", "20%"]);
  });
});

describe("Letter density - show more/less", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("By default, only top 5 letters are shown. If there are more than 5 letters, button 'Show more appears", () => {
    cy.typeText("aabbccddee");
    cy.shouldBeDensities(5);
    getElement("show-more").should("not.be.visible");
    getElement("show-less").should("not.be.visible");
    cy.typeText("f");
    getElement("show-more").should("be.visible");
    getElement("show-less").should("not.be.visible");
  });

  it("Clicking button 'Show more' shows all letters and changes the button to 'Show less'", () => {
    cy.typeText("aabbccddef");
    getElement("show-more").click();
    cy.shouldBeDensities(6);
    getElement("show-more").should("not.be.visible");
    getElement("show-less").should("be.visible");
  });

  it("Clicking button 'Show less' shows only top 5 letters and changes the button to 'Show more'", () => {
    cy.typeText("aabbccddef");
    getElement("show-more").click();
    getElement("show-less").click();
    cy.shouldBeDensities(5);
    getElement("show-more").should("be.visible");
    getElement("show-less").should("not.be.visible");
  });

  it("If number of different letters is decreased to be 5 or less, all letters are shown and button disappears", () => {
    cy.typeText("aabbccddef");
    getElement("show-more").should("be.visible");
    cy.typeText("{backspace}");
    getElement("show-more").should("not.be.visible");
    getElement("show-less").should("not.be.visible");
  });

  it("Show more/less state is remains when text is cleared", () => {
    cy.typeText("abcdef");
    getElement("show-more").click();
    getElement("text-area").clear().type("qwertyz");
    cy.shouldBeDensities(7);
    getElement("show-more").should("not.be.visible");
    getElement("show-less").should("be.visible");
  });
});
