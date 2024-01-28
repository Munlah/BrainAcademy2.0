// async function getAllCourses() {
//     try {
//         const response = await fetch('http://localhost:5050/getAllCourses');
//         const data = await response.json();
//         displayCourses(data.courses);
//     } 
//     catch (error) {
//         console.error('Error fetching courses:', error.message);
//         displayError('Failed to fetch courses. Please try again later.');
//     }
// }

// function displayCourses(courses) {
//     const coursesGrid = document.getElementById('coursesGrid');

//     courses.forEach(course => {
//         const topicBox = createTopicBox(course);
//         //topicBox.addEventListener('click', () => navigateToCourseDetails(course.id, course.topic));
//         coursesGrid.appendChild(topicBox);
//     });
// }

// function createTopicBox(course) {
//     const topicBox = document.createElement('div');
//     topicBox.className = 'topic-box';
//     topicBox.textContent = course.topic;
//     topicBox.dataset.courseId = course.id;  // Add courseId to data attribute
//     topicBox.dataset.topic = course.topic;  // Add topic to data attribute

//     topicBox.addEventListener('click', () => navigateToCourseDetails(course.id, course.topic));
//     return topicBox;
// }

// function navigateToCourseDetails(courseId, topic) {
//     localStorage.setItem('courseId', courseId);
//     localStorage.setItem('topic', topic);
//     window.location.href = '/courseDetails.html';
// }

// window.onload = getAllCourses;


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

window.onload = getAllCourses;
