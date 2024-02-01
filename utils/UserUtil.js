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
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    const users = await readFirestoreUsers();

    const user = users.find((user) => user.username === username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ message: 'Login successful!', user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteUser(req, res) {
  try {
    const { userId } = req.params; 

    // Query Firestore for the user with the specified ID
    const userDoc = await db.collection('users').doc(userId).get();

    if (userDoc.exists) {
      // Delete the user from Firestore
      await db.collection('users').doc(userId).delete();

      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    //console.error('Failed to delete user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  readFirestoreUsers,
  writeFirestoreUser,
  writeFirestore,
  registerUser,
  getUser,
  login,
  validatePassword,
  // updateUser,
  deleteUser,
};