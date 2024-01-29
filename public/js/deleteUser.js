document.addEventListener('DOMContentLoaded', function () {
  const deleteButton = document.getElementById('deleteButton');
  const userId = localStorage.getItem('userId');

  if (deleteButton) {
    deleteButton.addEventListener('click', async function () {
      const confirmed = await confirmAsync('Are you sure you want to delete your account?');

      if (confirmed) {
        try {
          const response = await fetch(`/deleteUser/${userId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          Navigate();
        } catch (error) {
          console.error('Error deleting user:', error);
          alert('An error occurred. Please try again.');
        }
      }
    });
  }

  function Navigate() {
    localStorage.removeItem('userId');
    window.location.href = '/index.html';
  }

  function confirmAsync(message) {
    return new Promise((resolve) => {
      const confirmed = confirm(message);
      resolve(confirmed);
    });
  }
});
