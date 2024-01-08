// Improved model for Quiz
class Quiz {
  constructor(quizId, quizTitle, quizCourse, questions) {
    this.quizId = quizId;
    this.quizTitle = quizTitle;
    this.quizCourse = quizCourse;
    this.questions = questions;
  }
}

module.exports = { Quiz };
