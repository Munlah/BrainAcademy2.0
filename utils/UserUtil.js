const { admin } = require('../firebaseAdmin.js');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Set the number of rounds to use for salt generation

const db = admin.firestore();

// Function to read data from Firestore
async function readFirestore(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    // console.error('Error reading Firestore:', err);
    // throw err;
    throw new Error('Internal Server Error');
  }
}

// Function to write data to Firestore
async function writeFirestore(data, collectionName) {
  try {
    const docRef = await db.collection(collectionName).add(data);
    return docRef.id;
  } catch (err) {
    // console.error('Error writing to Firestore:', err);
    // throw err;
    throw new Error('Internal Server Error');
  }
}

// Replace the existing readJSON and writeJSON functions with Firestore versions
async function readFirestoreUsers() {
  return readFirestore('users');
}

async function writeFirestoreUser(user) {
  return writeFirestore(user, 'users');
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
  const usernameInclusionRegex = new RegExp(username, 'i');
  const emailPrefix = email.split('@')[0];
  const emailInclusionRegex = new RegExp(emailPrefix, 'i');

  const errors = [];

  if (!lengthRegex.test(password)) {
    errors.push('Password must be at least 8 characters long.');
  }
  if (!uppercaseRegex.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (!lowercaseRegex.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (!numberRegex.test(password)) {
    errors.push('Password must contain at least one number.');
  }
  if (!specialCharRegex.test(password)) {
    errors.push('Password must contain at least one special character.');
  }
  if (consecutiveCharRegex.test(password)) {
    errors.push(
      'Password must not contain more than two identical characters in a row.'
    );
  }
  if (usernameInclusionRegex.test(password)) {
    errors.push('Password must not contain the username.');
  }
  if (emailInclusionRegex.test(password)) {
    errors.push('Password must not contain part of the email address.');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }
}

// Function to handle user registration
async function registerUser(req, res) {
  try {
    // Extracting user details from request body
    const { username, email, password, fullName, role, contactNumber } = req.body;

    // Validation that all required fields are filled in
    if (!username || !email || !password || !fullName || !role || !contactNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate password
    try {
      validatePassword(password, username, email);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    // Check if user already exists in Firestore
    const users = await readFirestoreUsers();
    if (users.some(user => user.username === username || user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new User instance
    const newUser = {
      username,
      email,
      password,
      passwordHash,
      fullName,
      role,
      contactNumber,
      status: 'active',
    };

    // Adding the new user to Firestore
    const userId = await writeFirestoreUser(newUser);

    // Respond with a success message
    return res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    // console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Function to get user data by username
async function getUser(req, res) {
  try {
    const { username } = req.params;

    // Query Firestore for the user with the specified username
    const usersSnapshot = await db.collection('users').where('username', '==', username).get();

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const user = userDoc.data();

      // Respond with the user details
      return res.status(200).json({
        id: userDoc.id,
        username: user.username,
        email: user.email,
        password: user.password, 
        passwordHash: user.passwordHash, 
        fullName: user.fullName,
        role: user.role,
        contactNumber: user.contactNumber,
        status: user.status,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // console.error('Failed to get user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


// Function for login
async function login(req, res) {
  try {
    // Request username and password on body
    const { username, password } = req.body;

    // Validation that both fields need to be filled in
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    // Checking if user exists in the Firestore
    const users = await readFirestoreUsers();

    // Find and Compare the users (Basically search)
    const user = users.find((user) => user.username === username);

    // If user do not match the database then return the message of invalid user
    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    // Compare the password in hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    // If password do not match the database then return the message of invalid password
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ message: 'Login successful!', user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// // Function to update user data by id
// async function updateUser(req, res) {
//   try {
//     const { id } = req.params;
//     const { username, email, password, fullName, role, contactNumber } =
//       req.body;

//     // Read the existing users data
//     const users = await readJSON('utils/users.json');

//     // Find the user and update their details
//     const userIndex = users.findIndex((user) => user.id === id);
//     if (userIndex === -1) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if the new username is already taken by another user
//     if (
//       username &&
//       users.some((user) => user.username === username && user.id !== id)
//     ) {
//       return res.status(400).json({ message: 'Username is already taken' });
//     }

//     // Validate the password if it's being changed
//     if (password) {
//       validatePassword(
//         password,
//         username || users[userIndex].username,
//         email || users[userIndex].email
//       );
//       users[userIndex].passwordHash = await bcrypt.hash(password, saltRounds);
//     }

//     // Update the user details
//     users[userIndex] = {
//       ...users[userIndex],
//       username: username || users[userIndex].username,
//       email: email || users[userIndex].email,
//       fullName: fullName || users[userIndex].fullName,
//       role: role || users[userIndex].role,
//       contactNumber: contactNumber || users[userIndex].contactNumber,
//     };

//     // Write the updated array back to the JSON file
//     await writeJSON(users, 'utils/users.json');

//     // Respond with the updated user details
//     const updatedUser = { ...users[userIndex] };
//     return res
//       .status(200)
//       .json({ message: 'User updated successfully', user: updatedUser });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// }


async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    // Read the existing users from Firestore
    const users = await readFirestoreUsers();

    // Find the index of the user with the given ID
    const userIndex = users.findIndex((user) => user.id === userId);

    // If the user with the given ID is not found, return an error
    if (userIndex === -1) {
      console.error(`User not found: ${userId}`);
      if (res && res.status && res.json) {
        return res.status(404).json({ message: 'User not found' });
      } else {
        console.error('Error: res is undefined or missing required methods');
        return; // or return some default response
      }
    }

    // Remove the user from Firestore
    await db.collection('users').doc(userId).delete();

    // Check if res.json exists before using it
    if (res && res.json) {
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      console.error('Error: res.json is undefined');
      return; // or return some default response
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error deleting user:', error);

    // Return the error response
    if (res && res.status && res.json) {
      return res.status(500).json({ message: 'Internal server error while deleting user' });
    } else {
      console.error('Error: res is undefined or missing required methods');
      return; // or return some default response
    }
  }
}


module.exports = {
  readFirestoreUsers,
  writeFirestoreUser,
  registerUser,
  getUser,
  login,
  validatePassword,
  // updateUser,
  deleteUser,
};