const { Quiz } = require('../models/Quiz');
const { Question } = require('../models/Question');
const fs = require('fs').promises;
const admin = require('firebase-admin');

const db = admin.firestore();

// to read contents of JSON and parse into JS object
async function readJSON(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err); //handle errors
    throw err;
  }
}

//to write contents on JSON
async function writeJSON(object, filename) {
  try {
    let allObjects = await readJSON(filename);

    if (!allObjects) {
      //if the file is empty or doesn't exist, create a new array (used for questions)
      allObjects = [];
    } else if (!Array.isArray(allObjects)) {
      //if the file contains an object and not an array
      allObjects = [allObjects];
    }

    allObjects.push(object);

    await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');

    return allObjects;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function viewQuestionsPerQuiz(req, res) {
  try {
    const quizId = parseInt(req.params.quizId);
    const allQuizzes = await readJSON('utils/quizzes.json');
    const quiz = allQuizzes.find((quiz) => quiz.quizId === quizId);

    if (!quiz) {
      console.log('Setting status 404');
      return res.status(404).json({ message: 'Quiz not found' });
    }

    console.log('Setting status 200');
    return res.status(200).json({ questions: quiz.questions });
  } catch (error) {
    console.error('Setting status 500:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

//validate whether a question is answered correctly or not (quizId, questionId, userOptionInput)
async function validateQuestionAnswer(req, res) {
  try {
    const quizId = parseInt(req.params.quizId);
    const questionId = parseInt(req.params.questionId);
    const userOptionInput = parseInt(req.params.userOptionInput);

    const allQuizzes = await readJSON('utils/quizzes.json'); //read contents of quizzes.json
    //find the specific quiz by its quizId
    const quiz = allQuizzes.find((quiz) => quiz.quizId === quizId);

    //throw error if quizId is not found
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    //find the specific question by the questionId
    const question = quiz.questions.find(
      (question) => question.questionId === questionId
    );

    //throw error if questionId is not found
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    //get the correct option for the question
    const correctOption = question.correctOption;
    console.log(correctOption);

    //the actual value of the correct option from the options array
    correctValue = '';

    //display the correct value from the options array based on the correctOption
    for (let i = 0; i < question.options.length; i++) {
      if (i == correctOption) {
        correctValue = question.options[i];
      }
    }

    //actually checks if the user given input is accurate to the correctOption and if not it shows the correct answer
    if (userOptionInput == correctOption) {
      return res
        .status(200)
        .json({ message: 'Good job! This is the correct answer' });
    } else {
      return res.status(200).json({
        message: 'Wrong answer! The correct answer was ' + correctValue,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//create new quiz with several questions
async function createQuizWithQuestions(req, res) {
  try {
    const { quizTitle, quizCourse, questions } = req.body;

    //validate that required data is provided
    if (!quizTitle || !quizCourse || !questions || !Array.isArray(questions)) {
      return res
        .status(400)
        .json({ message: 'Invalid data provided for creating quiz.' });
    }

    // array to hold the new questions
    const newQuestions = [];


    //loop through the provided questions and generate unique Ids
    for (const questionData of questions) {
      const { questionTitle, options, correctOption } = questionData;

      // Validate that correctOption is a valid index
      if (
        !Number.isInteger(correctOption) ||
        correctOption < 0 ||
        correctOption >= options.length
      ) {
        return res.status(400).json({
          message: 'Invalid correct option provided for creating quiz.',
        });
      }

      const questionTimestamp = new Date().getTime();
      const questionRandom = Math.floor(Math.random() * 1000);
      const questionId = parseInt(
        questionTimestamp + '' + questionRandom.toString().padStart(3, '0')
      );

      //create a new Question instance
      const newQuestion = new Question(
        questionId,
        questionTitle,
        options,
        correctOption
      );

      //add the new question to the array
      newQuestions.push(newQuestion);
    }

    //generate a unique Id for the quiz
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const quizId = parseInt(
      timestamp + '' + random.toString().padStart(3, '0')
    );

    //create a new Quiz instance with the generated ID and questions
    const newQuiz = new Quiz(quizId, quizTitle, quizCourse, newQuestions);

    //write the new quiz to the JSON file
    await writeJSON(newQuiz, 'utils/quizzes.json');

    return res
      .status(201)
      .json({ message: 'Quiz created successfully.', quiz: newQuiz });
  } catch (error) {

    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// View all quizzes function by course
async function viewAllQuizzesByCourse(req, res) {
  try {
    // Request the course from the URL
    const course = req.params.course;

    // Read the quizzes.json file
    const allQuizzes = await readJSON('utils/quizzes.json');

    // Filter the quizzes by course
    const quizzesByCourse = allQuizzes.filter(
      (quiz) => quiz.quizCourse === course
    );

    // Return the quizzes
    return res.status(200).json(quizzesByCourse);
  } catch (error) {
    return res.status(404).json({ message: 'No quizzes found' });
  }
}

// Function to handle the editing of a quiz
async function editQuiz(req, res) {
  try {
    const { quizId } = req.params;
    const { newQuizTitle, newQuizCourse, newQuestions } = req.body;

    const allQuizzes = await readJSON('utils/quizzes.json');
    const quizIndex = allQuizzes.findIndex(quiz => quiz.quizId === parseInt(quizId));

    if (quizIndex === -1) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check for the presence of required fields
    if (!newQuizTitle || !newQuizCourse || !newQuestions) {
      return res.status(400).json({ message: 'Missing required fields for editing quiz.' });
    }

    // Proceed with updating since all required fields are present
    allQuizzes[quizIndex].quizTitle = newQuizTitle;
    allQuizzes[quizIndex].quizCourse = newQuizCourse;
    allQuizzes[quizIndex].questions = newQuestions;

    await fs.writeFile('utils/quizzes.json', JSON.stringify(allQuizzes), 'utf8');
    return res.status(200).json({ message: 'Quiz updated successfully', quiz: allQuizzes[quizIndex] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function deleteQuiz(req, res) {
  try {
    const quizId = parseInt(req.params.quizId);

    const allQuizzes = await readJSON('utils/quizzes.json');

    const quizIndex = allQuizzes.findIndex((quiz) => quiz.quizId === quizId);

    if (quizIndex === -1) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    allQuizzes.splice(quizIndex, 1);

    await writeJSON(allQuizzes, 'utils/quizzes.json');

    return res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error occured attempted to delete quiz' });
  }
}

module.exports = {

  viewQuestionsPerQuiz, validateQuestionAnswer, createQuizWithQuestions, viewAllQuizzesByCourse, editQuiz, deleteQuiz, readJSON, writeJSON
};


