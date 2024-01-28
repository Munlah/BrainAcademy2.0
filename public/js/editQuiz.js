document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quizId");

  fetchQuizData(quizId);

  const form = document.getElementById("editQuizForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const updatedQuiz = gatherUpdatedQuizData();
    updateQuiz(quizId, updatedQuiz);
  });
});

function fetchQuizData(quizId) {
  fetch("/get-all-quizzes")
    .then((response) => response.json())
    .then((quizzes) => {
      const quizToEdit = quizzes.find((quiz) => quiz.id === quizId);
      if (quizToEdit) {
        populateFormFields(quizToEdit);
      } else {
        console.error("Quiz not found");
        alert("Quiz not found. Please check the quiz ID.");
      }
    })
    .catch((error) => console.error("Error fetching quiz data:", error));
}

function populateFormFields(quiz) {
  document.getElementById("quizTitle").value = quiz.quizTitle;
  document.getElementById("quizCourse").value = quiz.quizCourse;

  // Assuming there are exactly two questions for simplicity, extend as needed
  quiz.questions.forEach((question, index) => {
    const qNum = index + 1;
    document.getElementById(`question${qNum}Title`).value =
      question.questionTitle;
    question.options.forEach((option, optionIndex) => {
      document.getElementById(`question${qNum}Option${optionIndex + 1}`).value =
        option;
    });
    document.getElementById(`question${qNum}CorrectOption`).value =
      question.correctOption;
  });
}

function gatherUpdatedQuizData() {
  return {
    newQuizTitle: document.getElementById("quizTitle").value,
    newQuizCourse: document.getElementById("quizCourse").value,
    newQuestions: [gatherQuestionData(1), gatherQuestionData(2)],
  };
}

function gatherQuestionData(questionNumber) {
  return {
    questionTitle: document.getElementById(`question${questionNumber}Title`)
      .value,
    options: [
      document.getElementById(`question${questionNumber}Option1`).value,
      document.getElementById(`question${questionNumber}Option2`).value,
      document.getElementById(`question${questionNumber}Option3`).value,
    ],
    correctOption: parseInt(
      document.getElementById(`question${questionNumber}CorrectOption`).value,
      10
    ),
  };
}

function updateQuiz(quizId, updatedQuiz) {
  fetch(`/edit-quiz/${quizId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedQuiz),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Quiz updated successfully") {
        alert(data.message);
        navigateToQuizList();
      } else {
        alert(data.message); // Show error message from server
      }
    })
    .catch((error) => {
      console.error("Error updating quiz:", error);
      alert("Error updating quiz. Please try again.");
    });
}

// Navigation function used after successful quiz update
function navigateToQuizList() {
  window.location.href = "viewAllQuizzes.html";
}
