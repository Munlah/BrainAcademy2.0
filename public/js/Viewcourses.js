// viewAllCourses.js

async function getAllCourses() {
    try {
        const response = await fetch('http://localhost:5050/getAllCourses'); // Replace with your actual API endpoint
        const data = await response.json();

        console.log('API Response:', data); // Add this line for debugging

        if (response.ok) {
            const coursesGrid = document.getElementById('coursesGrid');

            data.courses.forEach(course => {
                const topicBox = document.createElement('div');
                topicBox.className = 'topic-box';
                topicBox.textContent = course.topic;

                // Add click event to navigate to details page
                topicBox.addEventListener('click', () => {
                    window.location.href = `http://localhost:5050/getcourse/${course.id}`; 
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
