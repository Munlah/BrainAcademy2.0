const { Course } = require('../models/Course');
const fs = require('fs').promises;

async function readJSON(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function writeJSON(data, filename) {
  try {
    await fs.writeFile(filename, JSON.stringify(data), 'utf8');
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function addCourse(req, res) {
  try {
    const { topic, description, video, category } = req.body;

    // Validate input
    if (!topic || !description || !video || !category) {
      return res.status(400).json({ message: 'Incomplete course data' });
    }

    // Read existing courses from the JSON file
    const allCourses = await readJSON('utils/course.json');

        // Check for duplicate topic
        if (allCourses.some(course => course.topic === topic)) {
            return res.status(409).json({ message: 'Topic already exists' });
        }

        // Check for duplicate topic
        if (allCourses.some(course => course.description === description)) {
            return res.status(409).json({ message: 'Description already exists' });
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
    const courseId = parseInt(
      timestamp + '' + random.toString().padStart(3, '0')
    );

    // Create a new Course instance
    const newCourse = new Course(courseId, topic, description, video, category);

    // Add the new course to the existing courses
    allCourses.push(newCourse);

    // Write the updated course list back to the JSON file
    await writeJSON(allCourses, 'utils/course.json');

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
