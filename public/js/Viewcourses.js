async function getAllCourses() {
    try {
        const response = await fetch('http://localhost:5050/getAllCourses');
        const data = await response.json();

        if (response.ok) {
            const coursesGrid = document.getElementById('coursesGrid');

            data.courses.forEach(course => {
                const topicBox = document.createElement('div');
                topicBox.className = 'topic-box';
                topicBox.textContent = course.topic;
                topicBox.addEventListener('click', () => {
                    const courseId = course.id;
                    const topic = course.topic;
                    // Set values in local storage
                    localStorage.setItem('courseId', courseId);
                    localStorage.setItem('topic', topic);

                    // Navigate to the course details page
                    window.location.href = 'http://localhost:5050/courseDetails.html';
                });
                coursesGrid.appendChild(topicBox);
            });
        }
    } catch (error) {
        console.error('Error fetching courses:', error.message);
    }
}

window.onload = getAllCourses;
