document.addEventListener('DOMContentLoaded', function () {
  const deleteButton = document.getElementById('deleteButton');

  if (deleteButton) {
    deleteButton.addEventListener('click', async function () {
      const confirmed = confirm('Are you sure you want to delete your account?');

      if (confirmed) {
        // Retrieve the userId from local storage
        const userId = localStorage.getItem('userId');
        try {
          const response = await fetch(`http://localhost:5050/deleteUser/${userId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
            window.location.href = "index.html"; // Redirect to login page
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
        } catch (error) {
          console.error('Error deleting user:', error);
          alert('An error occurred. Please try again.'); 
        }
      }
    });
  }
});
