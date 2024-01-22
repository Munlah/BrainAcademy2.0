// logout.js

document.addEventListener('DOMContentLoaded', function () {
    const logoutLink = document.getElementById('logoutLink');

    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();

            localStorage.removeItem('username');
            // localStorage.removeItem('userId');

            // Navigate to index.html
            window.location.href = 'index.html';
        });
    }
});
