async function getCourseById() {
    try {
        const urlParams = new URLSearchParams(window.location.search);

        // Extract courseId and topic from URL parameters
        const courseId = urlParams.get('courseId');
        const topic = urlParams.get('topic');

        console.log('Course ID:', courseId);
        console.log('Topic:', topic);

        // Use the correct API endpoint to fetch course details
        const response = await fetch(`/getcourse/${courseId}`);
        console.log('API Response:', response);

        const data = await response.json();
        console.log('API Data:', data);

        if (response.ok) {
            const courseDetails = document.getElementById('courseDetails');
            const course = data.course;

            const courseInfo = `
                <h2>${course.topic}</h2>
                <p><strong>Category:</strong> ${course.category}</p>
                <div class="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${getYouTubeVideoId(course.video)}" frameborder="0" allowfullscreen></iframe>
                </div>
                <p id="description" ><strong>Description:</strong> ${course.description}`;

            courseDetails.innerHTML = courseInfo;

            // Add "Start Quiz" button
            await getquiz(topic); // Pass the topic as a parameter

            // Append the quiz button to the 'quiz' div
            // const quiz = document.getElementById('quiz');
            // courseDetails.appendChild(quiz);
            const quiz = document.getElementById('quiz');
            quiz.appendChild(startQuizButton);

        }
    } catch (error) {
        console.error('Error fetching course details:', error.message);
    }
}

function getYouTubeVideoId(url) {
    // Extract video ID from YouTube URL
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}
window.onload = getCourseById();

async function getquiz(topic) {
    try {
        const response = await fetch(`/view-quizzes/${topic}`);

        if (response.ok) {
            const data = await response.json();
            console.log('Received quiz data:', data); // Add this line for debugging
            const quiz = document.getElementById('start-quiz-button');

            if (data && Array.isArray(data)) {
                data.forEach(quizData => {
                    console.log('Quiz data:', quizData); // Add this line for debugging

                    if (quizData.quizCourse === topic && quizData.questions && quizData.questions.length > 0) {
                        console.log('Quiz course matches topic and has questions.'); // Add this line for debugging

                        const startQuizButton = document.createElement('button');
                        startQuizButton.textContent = 'Start Quiz';
                        startQuizButton.style.borderRadius = '4px';
                        startQuizButton.classList.add('normal-button');
                        startQuizButton.id = 'redirectQuiz';
                        startQuizButton.addEventListener('click', function () {
                            const quizId = quizData.id; // Assuming 'id' is the quiz ID
                            console.log('Starting quiz with ID:', quizId); // Add this line for debugging
                            window.location.href = `/validateQuiz.html?quizId=${quizId}`;
                            //window.location.href = `http://localhost:5050/validateQuiz.html?quizId=${quizId}`;

                        });

                        quiz.appendChild(startQuizButton);
                    } else {
                        console.log('Quiz data does not match criteria.'); // Add this line for debugging
                    }
                });
            } else {
                console.error('Error: Invalid data structure or missing array in response.');
            }
        } else {
            console.error('Error fetching quizzes:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching quizzes:', error.message);
    }
}



