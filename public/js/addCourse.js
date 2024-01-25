function addCourse() {
    const modal = document.getElementById('addCourseModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('addCourseModal');
    modal.style.display = 'none';
    resetForm();
}

function resetForm() {
    // Clear form fields
    document.getElementById('addCourseForm').reset();
}

document.getElementById('addCourseForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const topic = document.getElementById('topic').value;
    const description = document.getElementById('description').value;
    const video = document.getElementById('video').value;
    const category = document.getElementById('category').value;

    // Validation for empty fields
    if (!topic || !description || !video || !category) {
        alert('Please fill in all fields.');
        return;  // Don't proceed with the API call if validation fails
    }

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

        getAllCourses1();
        // Display success message
        alert('Course added successfully!');
    } else {
        // Handle error
        console.error('Error adding course:', result.message);

        if (!topic || !description || !video || !category) {
            alert('Please fill in all fields.');
            return;  // Don't proceed with the API call if validation fails
        }
        if (response.status === 400) {
            if (result.message === 'Invalid video URL format') {
                alert('Invalid URL. Please enter a valid URL for the video.');
            } else if (result.message === 'Incomplete course data') {
                alert('Please fill in all fields.');
            } else if (result.message === 'Topic already exists' || result.message === 'Description already exists') {
                alert(result.message);
            } 
            else {
                alert('Error adding course. Please try again.');
            }
            resetForm();
        } else {
            console.error('Unexpected error:', result);
            alert(result.message, 'Please try again.');
        }
    }
});



async function getAllCourses1() {
    try {
        const response = await fetch('http://localhost:5050/getAllCourses');
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

