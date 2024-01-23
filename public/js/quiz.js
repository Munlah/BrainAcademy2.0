
async function getquiz() {
    try {
        const response = await fetch(`http://localhost:5050/view-all-quizzes/${topic}`);
        const data = await response.json();

        if (response.ok) {
            const quiz = document.getElementById('quiz');

            data.courses.forEach(course => {
                 if (course.quizIds && course.quizIds.length > 0) {
                const startQuizButton = document.createElement('button');
                startQuizButton.textContent = 'Start Quiz';
                startQuizButton.style.borderRadius = '4px';
                startQuizButton.classList.add('normal-button');
                startQuizButton.id = 'redirectQuiz';
                startQuizButton.addEventListener('click', function () {
                    // Redirect to another page
                    const quizId = course.quizIds[0]; // Assuming only one quiz for simplicity
                    window.location.href = `http://127.0.0.1:5500/public/validateQuiz.html?quizId=${quizId}`;
                });

                quiz.appendChild(startQuizButton);
            }
                //coursesGrid.appendChild(topicBox);
            });
        } else {
            console.error('Error fetching courses:', data.message);
        }
    } catch (error) {
        console.error('Error fetching courses:', error.message);
    }
}

window.onload = getquiz;
