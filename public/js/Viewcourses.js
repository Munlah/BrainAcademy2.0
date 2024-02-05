async function getAllCourses() {
    try {
        const response = await fetch('/getAllCourses');
        const data = await response.json();

        if (response.ok) {
            const coursesGrid = document.getElementById('coursesGrid');

            data.courses.forEach(course => {
                const topicBox = document.createElement('div');
                topicBox.className = 'topic-box';
                topicBox.textContent = course.topic;

                // Set data attributes for courseId and topic
                topicBox.dataset.courseId = course.id;
                topicBox.dataset.topic = course.topic;

                // Attach click event listener
                topicBox.addEventListener('click', navigateToCourseDetails);

                coursesGrid.appendChild(topicBox);
            });
        }
    } catch (error) {
        console.error('Error fetching courses:', error.message);
    }
}

function navigateToCourseDetails(event) {
    const courseId = event.target.dataset.courseId;
    const topic = event.target.dataset.topic;

    // Construct the URL with query parameters
    const url = `/courseDetails.html?courseId=${courseId}&topic=${encodeURIComponent(topic)}`;

    // Navigate to the course details page
    window.location.href = url;
}

window.onload = getAllCourses();
