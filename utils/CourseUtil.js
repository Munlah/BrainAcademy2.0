const { Course } = require('../models/Course');
const { admin } = require('../firebaseAdmin.js');
const fs = require('fs').promises;

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

async function writeFirestore(course) {
  try {
    const coursesCollection = db.collection('courses');
    await coursesCollection.add(course.toJSON()); // Convert to plain object before adding
  } catch (error) {
    // console.error('Error writing course to Firestore:', error);
    // throw error;
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

    // Simplify file path generation
    const courseId = Date.now() + Math.floor(Math.random() * 1000);

    // Create a new Course instance
    const newCourse = new Course(courseId, topic, description, video, category);

    //const courseId = Date.now() + Math.floor(Math.random() * 1000);
    
    // // Create a new Course instance
    // const newCourse = {
    //   id: courseId,
    //   topic,
    //   description,
    //   video, // Use the storage URL for the video link
    //   category,
    // };
    // Create a new Quiz instance

    // Add the new course details to Firestore in the 'course' collection
    await writeFirestoreCourse(newCourse, 'courses');

    return res.status(201).json({ message: 'Add Course successful!' });
  } catch (error) {
    // console.error('Error in addCourse:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

module.exports = {
  addCourse,
  writeFirestore,
  readFirestore
};


// async function getCourse(req, res) {
//   try {
//     const courseId = parseInt(req.params.id);

//     if (isNaN(courseId)) {
//       return res.status(400).json({ message: 'Invalid course ID' });
//     }

//     // Read existing courses from the JSON file
//     const allCourses = await readJSON('utils/course.json');

//     // Find the course with the specified ID
//     const course = allCourses.find((course) => course.id === courseId);

//     if (course) {
//       return res.status(200).json(course);
//     } else {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

// async function getAllCourses(req, res) {
//   try {
//     const allCourses = await readJSON('utils/course.json');

//     if (allCourses.length === 0) {
//       return res.status(200).json({ message: 'No courses available' });
//     }


//     return res.status(200).json(allCourses);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


// module.exports = {
//   addCourse
// };
