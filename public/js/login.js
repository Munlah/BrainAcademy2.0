function displayErrorMessage(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function redirectToUserRolePage(role) {
    const redirectUrl = (role === 'student') ? '/courses.html' : '/viewAllQuizzes.html';
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 2000);
}

function handleLoginResponse(data) {
    if (data.message === 'Login successful!') {
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user.id);
        redirectToUserRolePage(data.user.role);
    } else {
        displayErrorMessage(data.message);
    }
}

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Username and password are required');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => handleLoginResponse(data))
        .catch(error => console.error('Login error:', error));
});
