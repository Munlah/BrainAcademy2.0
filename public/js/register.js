document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("fullName").value;
    const contactNumber = document.getElementById("contactNumber").value;

    // Check if all fields are filled
    if (!username || !email || !password || !fullName || !contactNumber) {
      alert("All fields are required");
      return;
    }

    // Validate password and handle errors
    try {
      validatePassword(password, username, email);
      setPasswordErrorsVisible(false); // Hide password errors
    } catch (error) {
      displayPasswordErrors(error.message);
      return;
    }

    // Prepare the data to send in the request
    const userData = {
      username,
      email,
      password,
      fullName,
      contactNumber,
      role: "student", // 'student' is a default role
    };

    // Make the POST request to the registration endpoint
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json(); // Parse JSON response

      // Handle successful registration
      if (response.ok && data.message === "User registered successfully") {
        alert("Registration successful! Please login.");
        // Use a timeout to delay redirection to allow tests to check the UI state
        setTimeout(() => {
          window.location.href = "index.html"; // Redirect to login page
        }, 1000); // Adjust the delay as needed
      } else {
        // Handle server-side validation errors or other issues
        throw new Error(
          data.message || "An error occurred during registration."
        );
      }
    } catch (error) {
      // Display any error that occurred during the fetch request
      alert(error.message);
    }
  });

function setPasswordErrorsVisible(visible) {
  const passwordErrors = document.getElementById("passwordErrors");
  if (passwordErrors) {
    passwordErrors.style.display = visible ? "block" : "none";
  }
}

// Display password errors function remains unchanged
function displayPasswordErrors(errorString) {
  const passwordErrorsContainer = document.getElementById("passwordErrors");
  const passwordRequirementsList = passwordErrorsContainer.querySelector(
    ".password-requirements"
  );
  passwordRequirementsList.innerHTML = "";
  const errorMessages = errorString.split(". ");
  errorMessages.forEach((errorMessage) => {
    if (errorMessage) {
      const listItem = document.createElement("li");
      listItem.textContent = errorMessage;
      passwordRequirementsList.appendChild(listItem);
    }
  });
  passwordErrorsContainer.style.display = "block";
}

// Password validation function
function validatePassword(password, username, email) {
  const lengthRegex = /.{8,}/; // at least 8 characters
  const uppercaseRegex = /[A-Z]/; // at least one uppercase letter
  const lowercaseRegex = /[a-z]/; // at least one lowercase letter
  const numberRegex = /[0-9]/; // at least one number
  const specialCharRegex = /[\W_]/; // at least one special character
  const consecutiveCharRegex = /(.)\1\1/; // no more than two identical characters in a row

  // Check if the password contains the username or part of the email before '@'
  const usernameInclusionRegex = new RegExp(username, "i");
  const emailPrefix = email.split("@")[0];
  const emailInclusionRegex = new RegExp(emailPrefix, "i");

  const errors = [];

  if (!lengthRegex.test(password)) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!uppercaseRegex.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!lowercaseRegex.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!numberRegex.test(password)) {
    errors.push("Password must contain at least one number.");
  }
  if (!specialCharRegex.test(password)) {
    errors.push("Password must contain at least one special character.");
  }
  if (consecutiveCharRegex.test(password)) {
    errors.push(
      "Password must not contain more than two identical characters in a row."
    );
  }
  if (usernameInclusionRegex.test(password)) {
    errors.push("Password must not contain the username.");
  }
  if (emailInclusionRegex.test(password)) {
    errors.push("Password must not contain part of the email address.");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
}
