// This function is called when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quizId");

  // Fetch the quiz data and populate the form before adding event listeners
  fetchQuizData(quizId)
    .then(() => {
      // Only after fetching the quiz data attach the event listener to the form.
      const form = document.getElementById("editQuizForm");
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const updatedQuiz = gatherUpdatedQuizData();
        updateQuiz(quizId, updatedQuiz);
      });
    })
    .catch((error) => {
      console.error("Error setting up the form:", error);
      alert("Failed to load quiz data. Please try again.");

      // Redirect to viewAllQuizzes.html after user acknowledges the alert
      setTimeout(navigateToQuizList, 2000);
    });
});

// Fetches the quiz data and returns a promise.
function fetchQuizData(quizId) {
  return fetch("/get-all-quizzes")
    .then((response) => response.json())
    .then((quizzes) => {
      const quizToEdit = quizzes.find((quiz) => quiz.id === quizId);
      if (quizToEdit) {
        populateFormFields(quizToEdit);
      } else {
        console.error("Quiz not found");
        throw new Error("Quiz not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching quiz data:", error);
      if (error.message === "Quiz not found") {
        alert("Quiz not found. Please check the quiz ID.");
      } else {
        alert("Error fetching quiz data. Please try again.");
      }
      // Redirect to viewAllQuizzes.html after user acknowledges the alert
      setTimeout(navigateToQuizList, 2000);
    });
}

// Populates the form fields with the quiz data
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

// Gathers the updated quiz data from the form
function gatherUpdatedQuizData() {
  return {
    newQuizTitle: document.getElementById("quizTitle").value,
    newQuizCourse: document.getElementById("quizCourse").value,
    newQuestions: [gatherQuestionData(1), gatherQuestionData(2)],
  };
}

// Gathers the data for a single question from the form
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

// Update the quiz and navigate to the quiz list on success
function updateQuiz(quizId, updatedQuiz) {
  new Promise((resolve, reject) => {
    fetch(`/edit-quiz/${quizId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedQuiz),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Quiz updated successfully") {
          alert(data.message);
          resolve(data);
        } else {
          alert(data.message); // Show error message from server
          reject(new Error("Quiz update failed"));
        }
      })
      .catch((error) => {
        console.error("Error updating quiz:", error);
        alert("Error updating quiz. Please try again.");
        reject(new Error("Quiz update error"));
      });
  })
    .then(() => {
      setTimeout(navigateToQuizList, 2000);
    })
    .catch((error) => {
      // Handle any errors that occurred during update
      console.error(error);
    });
}

// Navigation function used after successful quiz update
function navigateToQuizList() {
  window.location.href = "viewAllQuizzes.html";
}
