document.addEventListener('DOMContentLoaded', function () {
    const deleteButton = document.getElementById('deleteButton');
  
    if (deleteButton) {
      deleteButton.addEventListener('click', async function () {
        const confirmed = confirm('Are you sure you want to delete your account?');
  
        if (confirmed) {
          // Retrieve the username from local storage
          const username = localStorage.getItem('username');
  
          if (!username) {
            alert('Username not found in local storage.');
            return;
          }
  
          try {
            const response = await fetch(`http://localhost:5050/deleteUser/${username}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
  
            const data = await response.json();
  
            if (response.ok) {
              alert(data.message); 
              localStorage.removeItem('username');
              window.location.href = 'index.html'; 
            } else {
              alert(data.message); 
            }
          } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred. Please try again.'); 
          }
        }
      });
    }
  });
  