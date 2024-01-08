// Improved model for Question
class Question {
  constructor(questionId, questionTitle, options, correctOption) {
    this.questionId = questionId;
    this.questionTitle = questionTitle;
    this.options = options;
    this.correctOption = correctOption;
  }
}

module.exports = { Question };
