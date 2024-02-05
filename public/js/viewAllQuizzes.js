function fetchAndDisplayQuizzes() {
  let quizToDelete = null;

  fetch("/get-all-quizzes")
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

        // Set data attributes for quizId on the edit button
        const editButton = quizElement.querySelector(".edit-button");
        editButton.dataset.quizId = quiz.id;

        // Attach click event listener to navigate using data attributes
        editButton.addEventListener("click", navigateToEditQuiz);

        const deleteButton = quizElement.querySelector(".delete-button");
        deleteButton.id = quiz.id;

        deleteButton.addEventListener("click", () => {
          quizToDelete = quiz.id;

          const modal = document.getElementById("myModal");
          const confirmDeleteButton = document.getElementById("confirm-delete");
          const cancelDeleteButton = document.getElementById("cancel-delete");

          modal.style.display = "block";

          confirmDeleteButton.addEventListener("click", () => {
            fetch(`/delete-quiz/${quizToDelete}`, {
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
  fetch("/getAllCourses")
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
        courseButton.textContent = course.topic;

        courseButton.addEventListener("click", () =>
          fetchAndDisplayQuizzesByCourse(course.topic)
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
  fetch(`/view-all-quizzes/${course}`)
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

          // Set data attributes for quizId on the edit button
          const editButton = quizElement.querySelector(".edit-button");
          editButton.dataset.quizId = quiz.id;

          // Attach click event listener to navigate using data attributes
          editButton.addEventListener("click", navigateToEditQuiz);

          const deleteButton = quizElement.querySelector(".delete-button");
          deleteButton.addEventListener("click", () => {
            const quizToDelete = quiz.id;

            const modal = document.getElementById("myModal");
            const confirmDeleteButton =
              document.getElementById("confirm-delete");
            const cancelDeleteButton = document.getElementById("cancel-delete");

            modal.style.display = "block";

            confirmDeleteButton.addEventListener("click", () => {
              fetch(`/delete-quiz/${quizToDelete}`, {
                method: "DELETE",
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  fetchAndDisplayQuizzesByCourse(course);
                })
                .catch((e) =>
                  console.log(
                    "There was a problem with your fetch operation: " +
                      e.message
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
      }
    })
    .catch((e) =>
      console.log("There was a problem with your fetch operation: " + e.message)
    );
}

function navigateToEditQuiz(event) {
  const quizId = event.currentTarget.dataset.quizId; // Use currentTarget to ensure we get the button's dataset
  const url = `/editQuiz.html?quizId=${quizId}`; // Construct the URL with quizId as a query parameter
  window.location.href = url; // Navigate to the edit quiz page
}