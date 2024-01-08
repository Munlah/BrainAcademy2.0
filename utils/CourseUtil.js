const { Course } = require('../models/Course');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const fs = require('fs').promises;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

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

// Function to upload file to Firebase Storage
async function uploadFile(filePath, storagePath) {
  const bucket = admin.storage().bucket(); // Get the default storage bucket

  await bucket.upload(filePath, {
    destination: storagePath,
    metadata: {
      contentType: 'image/jpeg', // Change the content type based on your file type
    },
  });

  // Get the public URL of the uploaded file
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
  return publicUrl;
}

// Replace the existing addCourse function with the updated version
async function addCourse(req, res) {
  try {
    const { topic, description, video, category, pic } = req.body;

    // Validate input
    if (!topic || !description || !video || !category || !pic) {
      return res.status(400).json({ message: 'Incomplete course data' });
    }

    // Check for duplicate topic in Firestore
    const existingCourses = await db.collection('courses').where('topic', '==', topic).get();
    if (!existingCourses.empty) {
      return res.status(409).json({ message: 'Topic already exists' });
    }

    // Validate input length
    if (topic.length > 100 || description.length > 500 || category.length > 50) {
      return res.status(400).json({ message: 'Invalid input length' });
    }

    const maxLength = 255;
    const videoUrlPattern = new RegExp(`^https?:\/\/\\S{1,${maxLength}}$`);

    if (!videoUrlPattern.test(video)) {
      return res.status(400).json({ message: 'Invalid video URL format' });
    }

    // Generate a unique ID for the new course
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const courseId = parseInt(timestamp + '' + random.toString().padStart(3, '0'));

    // Upload pic and video to Firebase Storage (assuming 'pic' and 'video' are file paths)
    const picUrl = await uploadFile(pic, `courses/${courseId}/pic.jpg`);
    const videoUrl = await uploadFile(video, `courses/${courseId}/video.mp4`);

    // Create a new Course instance
    const newCourse = {
      courseId,
      topic,
      description,
      video: videoUrl,
      category,
      pic: picUrl,
    };

    // Add the new course to Firestore
    await writeFirestore(newCourse, 'courses');

    return res.status(201).json({ message: 'Add Course successful!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function getCourse(req, res) {
  try {
    const courseId = parseInt(req.params.id);

    if (isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Read existing courses from the JSON file
    const allCourses = await readJSON('utils/course.json');

    // Find the course with the specified ID
    const course = allCourses.find((course) => course.id === courseId);

    if (course) {
      return res.status(200).json(course);
    } else {
      return res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getAllCourses(req, res) {
  try {
    const allCourses = await readJSON('utils/course.json');

    if (allCourses.length === 0) {
      return res.status(200).json({ message: 'No courses available' });
    }


    return res.status(200).json(allCourses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


module.exports = {
  addCourse,
  getCourse,
  getAllCourses,
};
