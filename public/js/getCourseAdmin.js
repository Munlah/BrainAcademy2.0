async function getAllCourses() {
    try {
        const response = await fetch('/getAllCourses');
        const data = await response.json();

        if (response.ok) {
            const coursesGrid1 = document.getElementById('coursesGrid1');

            coursesGrid1.innerHTML = '';

            data.courses.forEach(course => {
                const topicBox = document.createElement('div');
                topicBox.className = 'topic-box';
                topicBox.textContent = course.topic;
                coursesGrid1.appendChild(topicBox);
            });
        } else {
            console.error('Error fetching courses:', data.message);
        }
    } catch (error) {
        console.error('Error fetching courses:', error.message);
    }
}
window.onload = getAllCourses;

