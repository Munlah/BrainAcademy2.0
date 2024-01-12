class Quiz {
  constructor(quizTitle, quizCourse, questions) {
    this.quizTitle = quizTitle;
    this.quizCourse = quizCourse;
    this.questions = questions;
  }

  toFirestore() {
    return {
      quizTitle: this.quizTitle,
      quizCourse: this.quizCourse,
      questions: this.questions.map(question => question.toFirestore ? question.toFirestore() : question),
    };
  }
}

module.exports = { Quiz };