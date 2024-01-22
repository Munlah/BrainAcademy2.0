document.addEventListener('DOMContentLoaded', function () {
  // Extract quizId from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('quizId');

  // Check if quizId is available
  if (!quizId) {
    console.error('Quiz ID is missing in the URL');
    // You can handle this error, redirect to an error page, or take appropriate action
    return;
  }

  const displayQnsContainer = document.getElementById('display-qns');
  const results = document.getElementById('results');
  const submitButton = document.getElementById('submitQuiz');
  const redoButton = document.getElementById('redoQuiz');

  let correctOptions = []; // Global variable to store correct options

  // Function to get all questions for a quiz
  function getQuestions(quiz_id) {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:5050/view-all-questions-for-quiz/${quiz_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          // Store correct options for each question
          correctOptions = data.questions.map(question => question.correctOption);
          resolve(data.questions);
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error);
        });
    });
  }

  function showQuestions(questions, displayQnsContainer) {
    var output = [];
    // console.log(questions);
    // console.log(correctOptions);

    if (questions && questions.length > 0) {
      for (var i = 0; i < questions.length; i++) {
        output.push('<div class="question-container" style="border: 1px solid black; padding: 10px; margin: 10px auto; width: 50%;">');
        output.push('<div class="question">' + 'Question ' + (i + 1) + ': ' + questions[i].questionTitle + '</div>');

        if (questions[i].options && questions[i].options.length > 0) {
          // Wrap options in a div
          output.push('<div class="options-container">');

          for (var j = 0; j < questions[i].options.length; j++) {
            // Add unique identifier to each radio button
            const radioId = 'q' + i + 'option' + j;
            output.push(
              '<label style="display: inline-block; margin-right: 10px;">'
              + '<input type="radio" id="' + radioId + '" name="question' + i + '" value="' + j + '">'
              + 'Option ' + (j + 1) + ': ' + questions[i].options[j]
              + '</label>'
            );
          }

          output.push('</div>'); // Close options-container div
        } else {
          output.push('<div>No options available for this question.</div>');
        }

        output.push('</div>'); // Close the question-container div
      }
    } else {
      output.push('<div>No questions available for this quiz.</div>');
    }

    displayQnsContainer.innerHTML = output.join('');
  }

  // Call getQuestions and then showQuestions
  getQuestions(quizId)
    .then(questions => {
      showQuestions(questions, displayQnsContainer);
    })
    .then(() => {
      // After questions have been displayed, attach the click event listener
      submitButton.addEventListener('click', function () {
        validateBeforeSubmit();
      });
      redoButton.addEventListener('click', function () {
        redoQuiz();
      });
    })
    .catch(error => {
      console.error('Error fetching questions:', error);
    });

  function validateBeforeSubmit() {
    const selectedRadioButtons = document.querySelectorAll('input[type="radio"]:checked');

    if (selectedRadioButtons.length < correctOptions.length) {
      // Not all questions are attempted
      alert('Please attempt all questions before submitting.');
    } else {
      // All questions are attempted, confirm submission
      if (confirm('Are you sure you want to submit?')) {
        getResults();
      }
    }
  }

  function getResults() {
    const userAnswers = [];
    // console.log(userAnswers);

    // Collect user-selected options for each question
    for (let i = 0; i < correctOptions.length; i++) {
      const selectedOptionIndex = parseInt(document.querySelector('input[name="question' + i + '"]:checked').value, 10);
      userAnswers.push(selectedOptionIndex);
      // console.log(userAnswers);
    }

    // Send user answers to the server for validation
    validateAnswers(quizId, userAnswers);
  }

  function validateAnswers(quizId, userAnswers) {
    // Perform a fetch request to the server with quizId and userAnswers
    fetch('http://localhost:5050/validate-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quizId: quizId,
        userAnswers: userAnswers,
      }),
    })
      .then(response => response.json())
      .then(validationResults => {
        // Check if the response has the expected structure
        if (
          !validationResults ||
          typeof validationResults.results === 'undefined' ||
          typeof validationResults.correctAnswers === 'undefined'
        ) {
          console.error('Invalid server response:', validationResults);
          return;
        }

        // Loop through each result and update styling
        validationResults.results.forEach((result, index) => {
          const questionNumber = index + 1;
          const questionContainer = document.querySelector('.question-container:nth-of-type(' + questionNumber + ')');

          // Get user-selected option element
          const userSelectedOptionIndex = validationResults.results[index].userAnswer;
          const userSelectedOption = questionContainer.querySelector('input[value="' + userSelectedOptionIndex + '"]');

          // Get correct option element
          const correctOptionIndex = correctOptions[index];
          const correctOption = questionContainer.querySelector('input[value="' + correctOptionIndex + '"]');

          // Check if user selected an option (for incorrect answers)
          if (userSelectedOption) {
            userSelectedOption.parentNode.style.color = result.isCorrect ? 'green' : 'red';
          }

          // Check if correctOption is not undefined before accessing its parentNode
          if (correctOption) {
            correctOption.parentNode.style.color = 'green';
          }
        });

        // Display the user's score in the results div
        const userScore = `${validationResults.correctAnswers}/${validationResults.totalQuestions}`;
        results.innerHTML = `Your score is: ${userScore}`;

        // Hide submit button, show redo button
        submitButton.style.display = 'none';
        redoButton.style.display = 'block';
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function redoQuiz() {
    // Reload the page to start the quiz again
    location.reload();
  }
});
