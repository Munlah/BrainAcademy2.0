document.addEventListener('DOMContentLoaded', function () {
  const deleteButton = document.getElementById('deleteButton');
  const userId = localStorage.getItem('userId');

  if (deleteButton) {
    deleteButton.addEventListener('click', async function () {
      const confirmed = confirm('Are you sure you want to delete your account?');
      
      if (confirmed) {
        try {
          const response = await fetch(`/deleteUser/${userId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          //const data = await response.json();
          navigateToLogin();
        } 
        catch (error) {
          console.error('Error deleting user:', error);
         alert('An error occurred. Please try again.');
  
        }
      }
    });
  }

  function navigateToLogin() {
    localStorage.removeItem('userId');
    window.location.href = "/index.html";
  }
});
