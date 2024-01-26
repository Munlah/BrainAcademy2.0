document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    new Promise((resolve, reject) => {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Login successful!') {
                    // Store user id and username in local storage
                    localStorage.setItem('username', data.user.username);
                    localStorage.setItem('userId', data.user.id);

                    resolve(data);
                } else if (!username || !password) {
                    alert('Username and password are required');
                    reject(new Error('Username and password are required'));
                } else {
                    // Show error message
                    if (data.message === 'Invalid username') {
                        alert('Invalid username');
                    } else if (data.message === 'Invalid password') {
                        alert('Invalid password');
                    } else {
                        const errorElement = document.getElementById('error');
                        errorElement.textContent = data.message;
                        errorElement.style.display = 'block';
                    }

                    reject(new Error(data.message));
                }
            });
    }).then((data)=> {
        setTimeout(() => {
           // Redirect based on user role
        if (data.user.role === 'student') {
            window.location.href = '/courses.html';
        } else if (data.user.role === 'enterprise') {
            window.location.href = '/viewAllQuizzes.html';
        }
        }, 2000);
        
    });
});