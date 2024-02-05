document.getElementById('addQuizForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const quizTitle = document.getElementById('quizTitle').value;
  const quizCourse = document.getElementById('quizCourse').value;

  const questionOneTitle = document.getElementById('questionOneTitle').value;
  const questionOneOptionOne = document.getElementById('questionOneOptionOne').value;
  const questionOneOptionTwo = document.getElementById('questionOneOptionTwo').value;
  const questionOneOptionThree = document.getElementById('questionOneOptionThree').value;
  const questionOneCorrectOption = parseInt(document.getElementById('questionOneCorrectOption').value, 10);

  const questionTwoTitle = document.getElementById('questionTwoTitle').value;
  const questionTwoOptionOne = document.getElementById('questionTwoOptionOne').value;
  const questionTwoOptionTwo = document.getElementById('questionTwoOptionTwo').value;
  const questionTwoOptionThree = document.getElementById('questionTwoOptionThree').value;
  const questionTwoCorrectOption = parseInt(document.getElementById('questionTwoCorrectOption').value, 10);

  //validate that none of the fields are empty
  if (
    !quizTitle ||
    !quizCourse ||
    !questionOneTitle || !questionOneOptionOne || !questionOneOptionTwo || !questionOneOptionThree ||
    isNaN(questionOneCorrectOption) ||
    !questionTwoTitle || !questionTwoOptionOne || !questionTwoOptionTwo || !questionTwoOptionThree ||
    isNaN(questionTwoCorrectOption)
  ) {
    alert('Please fill in all fields');
    return;
  }

  let quizBody = {
    quizTitle,
    quizCourse,
    questions: [
      {
        questionTitle: questionOneTitle,
        options: [questionOneOptionOne, questionOneOptionTwo, questionOneOptionThree],
        correctOption: questionOneCorrectOption,
      },
      {
        questionTitle: questionTwoTitle,
        options: [questionTwoOptionOne, questionTwoOptionTwo, questionTwoOptionThree],
        correctOption: questionTwoCorrectOption,
      },
    ],
  };
  // console.log('Quiz Body:', JSON.stringify(quizBody));

  fetch('/create-new-quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quizBody),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response Data:', data);
      if (data.message === 'Quiz created successfully.') {
        alert('Quiz created successfully.');
        window.location.href = '/viewAllQuizzes.html';
      } else {
        alert(data.message); // Show backend validation message as an alert
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error creating quiz. Please try again.'); // Show a generic error alert
    });

});
