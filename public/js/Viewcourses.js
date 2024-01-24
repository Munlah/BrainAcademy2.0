
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

                // // Add click event to navigate to details page
                // topicBox.addEventListener('click', () => {
                //     window.location.href = `http://127.0.0.1:5500/public/courseDetails.html?courseId=${course.id}`;
                // });
                // Assuming course is an object with properties like id and topic
                // Add click event to navigate to details page
                topicBox.addEventListener('click', () => {
                    const courseId = course.id;
                    const topic = course.topic;
                    console.log(topic);

                    // Encode the parameters to ensure they are properly formatted in the URL
                    const encodedCourseId = encodeURIComponent(courseId);
                    const encodedTopic = encodeURIComponent(topic);

                    // Update the URL to include both course ID and topic
                    window.location.href = `http://127.0.0.1:5500/public/courseDetails.html?courseId=${encodedCourseId}&topic=${encodedTopic}`;
                });


                coursesGrid.appendChild(topicBox);
            });
        } else {
            console.error('Error fetching courses:', data.message);
        }
    } catch (error) {
        console.error('Error fetching courses:', error.message);
    }
}

window.onload = getAllCourses;
