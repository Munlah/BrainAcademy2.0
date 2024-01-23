function fetchAndDisplayQuizzes() {
  let quizToDelete = null;

  fetch("http://localhost:5050/get-all-quizzes")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((quizzes) => {
      const container = document.getElementById("display-all-quizzes");

      container.innerHTML = "";

      const template = document.getElementById("quiz-template");

      quizzes.forEach((quiz) => {
        const quizElement = template.content.cloneNode(true);
        quizElement.querySelector(".quiz-title").textContent = quiz.quizTitle;

        const editButton = quizElement.querySelector(".edit-button");
        editButton.addEventListener("click", () => {
          window.location.href = `editQuiz.html?quizId=${quiz.id}`;
        });

        const deleteButton = quizElement.querySelector(".delete-button");
        deleteButton.id = quiz.id;

        deleteButton.addEventListener("click", () => {
          quizToDelete = quiz.id;

          const modal = document.getElementById("myModal");
          const confirmDeleteButton = document.getElementById("confirm-delete");
          const cancelDeleteButton = document.getElementById("cancel-delete");

          modal.style.display = "block";

          confirmDeleteButton.addEventListener("click", () => {
            fetch(`http://localhost:5050/delete-quiz/${quizToDelete}`, {
              method: "DELETE",
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                fetchAndDisplayQuizzes();
              })
              .catch((e) =>
                console.log(
                  "There was a problem with your fetch operation: " + e.message
                )
              );

            modal.style.display = "none";
          });

          cancelDeleteButton.addEventListener("click", () => {
            modal.style.display = "none";
          });
        });

        container.appendChild(quizElement);
      });
    })
    .catch((e) =>
      console.log("There was a problem with your fetch operation: " + e.message)
    );
}

fetchAndDisplayQuizzes();

function fetchAndDisplayCourses() {
  fetch("http://localhost:5050/getAllCourses")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((courses) => {
      const container = document.getElementById("display-all-courses");

      const template = document.getElementById("course-template");

      const allButtonElement = template.content.cloneNode(true);
      const allButton = allButtonElement.querySelector(".course-button");
      allButton.textContent = "All";
      allButton.addEventListener("click", fetchAndDisplayQuizzes);
      container.appendChild(allButtonElement);

      courses.courses.forEach((course) => {
        const courseElement = template.content.cloneNode(true);

        const courseButton = courseElement.querySelector(".course-button");
        courseButton.textContent = course.category;

        courseButton.addEventListener("click", () =>
          fetchAndDisplayQuizzesByCourse(course.category)
        );

        container.appendChild(courseElement);
      });
    })
    .catch((e) =>
      console.log("There was a problem with your fetch operation: " + e.message)
    );
}

fetchAndDisplayCourses();

function fetchAndDisplayQuizzesByCourse(course) {
  fetch(`http://localhost:5050/view-all-quizzes/${course}`)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          const container = document.getElementById("display-all-quizzes");
          container.innerHTML =
            '<p class="no-quizzes-message">No quizzes found for this course</p>';
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        return response.json();
      }
    })
    .then((quizzes) => {
      if (quizzes) {
        const container = document.getElementById("display-all-quizzes");
        container.innerHTML = "";

        const template = document.getElementById("quiz-template");

        quizzes.forEach((quiz) => {
          const quizElement = template.content.cloneNode(true);

          quizElement.querySelector(".quiz-title").textContent = quiz.quizTitle;

          container.appendChild(quizElement);
        });
      }
    })
    .catch((e) =>
      console.log("There was a problem with your fetch operation: " + e.message)
    );
}
