const { Course } = require('../models/Course');
const { Quiz } = require('../models/Quiz');

const { admin } = require('../firebaseAdmin.js');
const fs = require('fs').promises;

const db = admin.firestore();

async function readFirestore(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {

    throw new Error('Internal Server Error');
  }
}


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
async function readFirestoreCourse() {
  return readFirestore('courses');
}

async function writeFirestoreCourse(course) {
  return writeFirestore(course, 'courses');
}

async function addCourse(req, res) {
  try {
    const { topic, description, video, category } = req.body;

    // Validate input
    if (!topic || !description || !video || !category) {
      return res.status(400).json({ message: 'Incomplete course data' });
    }

    // Validate input length
    if (topic.length > 100 || description.length > 500 || category.length > 50) {
      return res.status(400).json({ message: 'Invalid input length' });
    }

    // Validate video URL format
    const maxLength = 255;
    const videoUrlPattern = new RegExp(`^https?://\\S{1,${maxLength}}$`);

    if (!videoUrlPattern.test(video)) {
      return res.status(400).json({ message: 'Invalid video URL format' });
    }

    // Check for duplicate topic or description
    const courses = await readFirestoreCourse();
    if (courses.some(course => course.topic === topic)) {
      return res.status(409).json({ message: 'Topic already exists' });
    }

    if (courses.some(course => course.description === description)) {
      return res.status(409).json({ message: 'Description already exists' });
    }

    // Create a new Course instance
    //const newCourse = new Course(topic, description, video, category);
    // Create new User instance
    const newCourse = {
      topic,
      description,
      video,
      category
    };

    // Adding the new user to Firestore
    const courseId = await writeFirestoreCourse(newCourse);

    // Add the new course details to Firestore in the 'course' collection
    //await writeFirestoreCourse(newCourse);

    return res.status(201).json({ message: 'Add Course successful!', courseId });
  } catch (error) {
    // console.error('Error in addCourse:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
async function getAllCourses(req, res) {
  try {
    const courses = await readFirestoreCourse();

    if (courses.length === 0) {
      return res.status(200).json({ message: 'No courses available' });
    }

    return res.status(200).json({ courses });
  } catch (error) {
    //console.error('Error in getAllCourses:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

async function getCourseById(req, res) {
  try {
    const courseId = req.params.id;

    // Validate if courseId is provided
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is missing in the request parameters' });
    }

    // Query Firestore to find the course with the specified ID
    const courseSnapshot = await db.collection('courses').doc(courseId).get();

    // Check if the course exists
    if (!courseSnapshot.exists) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const foundCourse = { id: courseSnapshot.id, ...courseSnapshot.data() };

    return res.status(200).json({ course: foundCourse });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}


module.exports = {
  addCourse,
  getAllCourses,
  getCourseById, // Add the new function to exports
  writeFirestore,
  readFirestore
};

