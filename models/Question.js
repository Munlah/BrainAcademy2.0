class Question {
  constructor(questionTitle, options, correctOption) {
    this.questionTitle = questionTitle;
    this.options = options;
    this.correctOption = correctOption;
  }

  toFirestore() {
    return {
      questionTitle: this.questionTitle,
      options: this.options,
      correctOption: this.correctOption,
    };
  }
}

module.exports = { Question };