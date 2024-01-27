// async function getAllCourses() {
//     try {
//         const response = await fetch('/getAllCourses');

//         if (!response.ok) {
//             throw new Error('Failed to fetch courses');
//         }

//         const data = await response.json();
//         displayCourses(data.courses);
//     } catch (error) {
//         console.error('Error fetching courses:', error.message);
//         displayError('Failed to fetch courses. Please try again later.');
//     }
// }

// function displayCourses(courses) {
//     const coursesGrid = document.getElementById('coursesGrid');

//     courses.forEach(course => {
//         const topicBox = createTopicBox(course);
//         coursesGrid.appendChild(topicBox);
//     });
// }

// function createTopicBox(course) {
//     const topicBox = document.createElement('div');
//     topicBox.className = 'topic-box';
//     topicBox.textContent = course.topic;
//     topicBox.addEventListener('click', () => {
//         navigateToCourseDetails(course.id, course.topic);
//     });
//     return topicBox;
// }

// function navigateToCourseDetails(courseId, topic) {
//     localStorage.setItem('courseId', courseId);
//     localStorage.setItem('topic', topic);
//     window.location.href = '/courseDetails.html';
// }

// // function displayError(message) {
// //     console.error(message);
// // }

// window.onload = getAllCourses;
async function getAllCourses() {
    try {
        const response = await fetch('/getAllCourses');

        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        displayCourses(data.courses);
    } catch (error) {
        console.error('Error fetching courses:', error.message);
        displayError('Failed to fetch courses. Please try again later.');
    }
}

function displayCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');

    courses.forEach(course => {
        const topicBox = createTopicBox(course);
        topicBox.addEventListener('click', () => navigateToCourseDetails(course.id, course.topic));
        coursesGrid.appendChild(topicBox);
    });
}

function createTopicBox(course) {
    const topicBox = document.createElement('div');
    topicBox.className = 'topic-box';
    topicBox.textContent = course.topic;
    return topicBox;
}

function navigateToCourseDetails(courseId, topic) {
    localStorage.setItem('courseId', courseId);
    localStorage.setItem('topic', topic);
    window.location.href = '/courseDetails.html';
}

// function displayError(message) {
//     console.error(message);
// }

window.onload = getAllCourses;
