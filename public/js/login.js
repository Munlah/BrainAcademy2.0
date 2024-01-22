document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
      alert('Username and password are required');
      return;
  }

  fetch('http://localhost:5050/login', {
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
              localStorage.setItem('userId', data.user.id);
              localStorage.setItem('username', data.user.username);

              // Redirect based on user role
              if (data.user.role === 'student') {
                  window.location.href = 'http://127.0.0.1:5500/public/courses.html';
              } else if (data.user.role === 'enterprise') {
                  window.location.href = 'http://127.0.0.1:5500/public/viewAllQuizzes.html';
              }
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
          }
      });
});