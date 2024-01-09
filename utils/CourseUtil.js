const { Course } = require('../models/Course');
const { admin } = require('../firebaseAdmin.js');
const fs = require('fs').promises;

// Get a reference to Firestore
const db = admin.firestore();

// Function to read data from Firestore
async function readFirestore(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('Error reading Firestore:', err);
    throw err;
  }
}

// Function to write data to Firestore
async function writeFirestore(data, collectionName) {
  try {
    const docRef = await db.collection(collectionName).add(data);
    return docRef.id;
  } catch (err) {
    console.error('Error writing to Firestore:', err);
    throw err;
  }
}

// async function readFirestoreUsers() {
//   return readFirestore('courses');
// }

async function writeFirestoreCourse(course) {
  return writeFirestore(course, 'courses');
}



// Function to upload file to Firebase Storage
// Updated uploadFile function to handle both images and videos
async function uploadFile(filePath, storagePath, contentType) {
  const bucket = admin.storage().bucket();

  if (filePath.startsWith('http')) {
    // If the file path is an online link, return it directly
    return filePath;
  }

  // If the file path is a local file, proceed with the upload
  await bucket.upload(filePath, {
    destination: storagePath,
    metadata: {
      contentType: contentType,
    },
  });

  // Get the public URL of the uploaded file
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

  return publicUrl;
}


// Updated addCourse function
async function addCourse(req, res) {
  try {
    const { topic, description, video, category, pic } = req.body;

    // Validate input
    if (!topic || !description || !video || !category || !pic) {
      return res.status(400).json({ message: 'Incomplete course data' });
    }

    // Check for duplicate topic in Firestore
    const existingCourses = await db.collection('course').where('topic', '==', topic).get();
    if (!existingCourses.empty) {
      return res.status(409).json({ message: 'Topic already exists' });
    }

    // Validate input length
    if (topic.length > 100 || description.length > 500 || category.length > 50) {
      return res.status(400).json({ message: 'Invalid input length' });
    }

    const maxLength = 255;
    const videoUrlPattern = new RegExp(`^https?://\\S{1,${maxLength}}$`);

    if (!videoUrlPattern.test(video)) {
      return res.status(400).json({ message: 'Invalid video URL format' });
    }

    // Simplify file path generation
    const courseId = Date.now() + Math.floor(Math.random() * 1000);

    // Upload pic and video link to Firebase Storage
    const picUrl = await uploadFile(pic, `courses/${courseId}/pic.jpg`, 'image/jpeg');
    const videoUrl = await uploadFile(video, `courses/${courseId}/video.txt`, 'text/plain');

    // Create a new Course instance
    const newCourse = {
      id: courseId,
      topic,
      description,
      video: videoUrl, // Use the storage URL for the video link
      category,
      pic: picUrl,
    };

    // Add the new course details to Firestore in the 'course' collection
    await writeFirestoreCourse(newCourse, 'course');

    return res.status(201).json({ message: 'Add Course successful!' });
  } catch (error) {
    console.error('Error in addCourse:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

module.exports = {
  addCourse
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
