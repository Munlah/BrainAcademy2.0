function addCourse() {
    const modal = document.getElementById('addCourseModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('addCourseModal');
    modal.style.display = 'none';
}



document.getElementById('addCourseForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const topic = document.getElementById('topic').value;
    const description = document.getElementById('description').value;
    const video = document.getElementById('video').value;
    const category = document.getElementById('category').value;

    // Call your API to add the course
    const response = await fetch('http://localhost:5050/addCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, description, video, category }),
    });

    const result = await response.json();

    if (response.ok) {
        // Course added successfully
        closeModal();
        // Clear form fields
        document.getElementById('addCourseForm').reset();
    
        getAllCourses();
        // Display success message
        alert('Course added successfully!');
    } else {
        // Handle error
        console.error('Error adding course:', result.message);
        alert('Error adding course. Please try again.');
    }
});



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

                // Add click event to navigate to details page
                topicBox.addEventListener('click', () => {
                    window.location.href = `http://127.0.0.1:5500/public/courseDetails.html?courseId=${course.id}`;
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
