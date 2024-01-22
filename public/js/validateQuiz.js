// Function to get all questions for a quiz
var quiz_id = 'OGA1Xw7egdEBFOzXJAMq';
const displayQnsContainer = document.getElementById('display-qns');
var results = document.getElementById('results');
var submitButton = document.getElementById('submitQuiz')

function getQuestions(quiz_id) {
  fetch(`http://localhost:5050/view-all-questions-for-quiz/${quiz_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      // Display questions in the console
      console.log('Questions:', data);

      // If you want to display questions in the HTML, you can append them to an element
      // displayQnsElement.innerHTML = JSON.stringify(data, null, 2); // Beautify JSON for display
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

getQuestions(quiz_id);

function showQuestions(questions, displayQnsContainer) {
  var output = [];

  // For each question
  for (var i = 0; i < questions.length; i++) {
    // Display the question title
    output.push('<div class="question">' + questions[i].questionTitle + '</div>');

    // Check if options exist
    if (questions[i].options && questions[i].options.length > 0) {
      // For each option in the question
      for (var j = 0; j < questions[i].options.length; j++) {
        // Add radio button
        output.push(
          '<label>'
          + '<input type="radio" name="question' + i + '" value="' + j + '">'
          + 'Option ' + (j + 1) + ': ' + questions[i].options[j]
          + '</label>'
        );
      }
    } else {
      output.push('<div>No options available for this question.</div>');
    }
  }

  // Finally, combine our output list into one string of HTML and put it on the page
  displayQnsContainer.innerHTML = output.join('');
}

showQuestions(getQuestions(quiz_id), displayQnsContainer);














// // Assuming you have an element with id 'submit' for fetching results
// document.getElementById('submit').addEventListener('click', function () {
//   // Call the function to get results when the 'Get Results' button is clicked
//   getResults();
// });

// // Function to get results (you need to implement this function)
// function getResults() {
//   // Implement your logic to get results here
//   console.log('Getting results...');
// }
