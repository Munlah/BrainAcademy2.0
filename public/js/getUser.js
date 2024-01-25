function getUserProfile() {
    const username = localStorage.getItem("username");
  
    fetch(`/getUser/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((userProfile) => {
        displayUserProfile(userProfile);
      })
      .catch((error) => {
        console.error("Fetching user profile failed:", error);
      });
  }
  
  function displayUserProfile(userProfile) {
    document.getElementById("fullName").value = userProfile.fullName;
    document.getElementById("username").value = userProfile.username;
    document.getElementById("email").value = userProfile.email;
    document.getElementById("contactNumber").value = userProfile.contactNumber;
    document.getElementById("role").value = userProfile.role;
    if (userProfile.photoUrl) {
      document.getElementById("userPhoto").src = userProfile.photoUrl;
    }
  }
  
  document.addEventListener("DOMContentLoaded", getUserProfile);