document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quizId");

  fetch(`http://localhost:5050/get-all-quizzes`)
    .then((response) => response.json())
    .then((quizzes) => {
      const quizToEdit = quizzes.find((quiz) => quiz.id === quizId);
      if (quizToEdit) {
        document.getElementById("quizTitle").value = quizToEdit.quizTitle;
        document.getElementById("quizCourse").value = quizToEdit.quizCourse;

        document.getElementById("question1Title").value =
          quizToEdit.questions[0].questionTitle;
        document.getElementById("question1Option1").value =
          quizToEdit.questions[0].options[0];
        document.getElementById("question1Option2").value =
          quizToEdit.questions[0].options[1];
        document.getElementById("question1Option3").value =
          quizToEdit.questions[0].options[2];
        document.getElementById("question1CorrectOption").value =
          quizToEdit.questions[0].correctOption;

        document.getElementById("question2Title").value =
          quizToEdit.questions[1].questionTitle;
        document.getElementById("question2Option1").value =
          quizToEdit.questions[1].options[0];
        document.getElementById("question2Option2").value =
          quizToEdit.questions[1].options[1];
        document.getElementById("question2Option3").value =
          quizToEdit.questions[1].options[2];
        document.getElementById("question2CorrectOption").value =
          quizToEdit.questions[1].correctOption;
      }
    })
    .catch((error) => console.error("Error:", error));

  document
    .getElementById("editQuizForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Gather updated quiz data
      const updatedQuiz = {
        newQuizTitle: document.getElementById("quizTitle").value,
        newQuizCourse: document.getElementById("quizCourse").value,
        newQuestions: [
          {
            questionTitle: document.getElementById("question1Title").value,
            options: [
              document.getElementById("question1Option1").value,
              document.getElementById("question1Option2").value,
              document.getElementById("question1Option3").value,
            ],
            correctOption: parseInt(
              document.getElementById("question1CorrectOption").value
            ),
          },
          {
            questionTitle: document.getElementById("question2Title").value,
            options: [
              document.getElementById("question2Option1").value,
              document.getElementById("question2Option2").value,
              document.getElementById("question2Option3").value,
            ],
            correctOption: parseInt(
              document.getElementById("question2CorrectOption").value
            ),
          },
        ],
      };

      fetch(`http://localhost:5050/edit-quiz/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedQuiz),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Quiz updated successfully") {
            alert(data.message);
            window.location.href =
              "http://127.0.0.1:5500/public/viewAllQuizzes.html";
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error updating quiz. Please try again.");
        });
    });
});
