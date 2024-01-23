async function getCourseById() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('courseId');

        console.log('Course ID:', courseId); // Add this line for debugging

        const response = await fetch(`http://localhost:5050/getcourse/${courseId}`);
        console.log('API Response:', response); // Add this line for debugging

        const data = await response.json();
        console.log('API Data:', data); // Add this line for debugging

        if (response.ok) {
            const courseDetails = document.getElementById('courseDetails');
            const course = data.course;

            const courseInfo = `
                <h2>${course.topic}</h2>
                <p><strong>Category:</strong> ${course.category}</p>
                <div class="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${getYouTubeVideoId(course.video)}" frameborder="0" allowfullscreen></iframe>
                </div>
                <p><strong>Description:</strong> ${course.description}</p>`;

            courseDetails.innerHTML = courseInfo;

            // Check if quizIds exist and show the "Start Quiz" button
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

                courseDetails.appendChild(startQuizButton);
            }
        } else {
            console.error('Error fetching course details:', data.message);
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

window.onload = getCourseById;
