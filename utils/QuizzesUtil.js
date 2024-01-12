const { Quiz } = require('../models/Quiz');
const { Question } = require('../models/Question');
const { admin } = require('../firebaseAdmin.js');

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

async function readFirestore(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('Error reading Firestore:', err);
    throw err;
  }
}

// Create new quiz with several questions
async function createQuizWithQuestions(req, res) {
  try {
    const { quizTitle, quizCourse, questions } = req.body;

    // Validate that required data is provided
    if (!quizTitle || !quizCourse || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid data provided for creating quiz.' });
    }

    // Validate each question
    for (const questionData of questions) {
      const { questionTitle, options, correctOption } = questionData;

      // Validate that correctOption is a valid index
      if (!Number.isInteger(correctOption) || correctOption < 0 || correctOption >= options.length) {
        return res.status(400).json({ message: 'Invalid correct option provided for creating quiz.' });
      }
    }

    // Create an array of Question instances
    const newQuestions = questions.map(questionData => new Question(questionData.questionTitle, questionData.options, questionData.correctOption));

    // Create a new Quiz instance
    const newQuiz = new Quiz(quizTitle, quizCourse, newQuestions);

    // Write the new quiz to Firestore
    const quizId = await writeFirestore(newQuiz.toFirestore(), 'quizzes');

    // Log the response before sending it
    console.log('Response:', JSON.stringify({ message: 'Quiz created successfully.', quiz: { quizId, ...newQuiz } }));

    return res.status(201).json({ message: 'Quiz created successfully.', quiz: { quizId, ...newQuiz } });

  } catch (error) {
    console.error(error);

    // Log the response in case of an error
    console.log('Response:', JSON.stringify({ message: 'Internal Server Error' }));

    return res.status(500).json({ message: 'Internal Server Error' });
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

// View all quizzes function by course
async function viewAllQuizzesByCourse(req, res) {
  try {
    // Request the course from the URL
    const course = req.params.course;

    // Read from the Firestore collection
    const allQuizzes = await readFirestore('quizzes');

    // Filter quizzes by course
    const quizzesByCourse = allQuizzes.filter(quiz => quiz.quizCourse === course);

    if (quizzesByCourse.length === 0) {
      return res.status(404).json({ message: 'No quizzes found' });
    }

    // Return the quizzes
    return res.status(200).json(quizzesByCourse);
  } catch (error) {
    return res.status(500).json({ message: 'Error reading from Firestore' });
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
    const quizId = req.params.quizId;

    const quizRef = db.collection('quizzes').doc(quizId);

    const doc = await quizRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await quizRef.delete();

    return res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error occurred attempting to delete quiz' });
  }
}

module.exports = {

  viewQuestionsPerQuiz, validateQuestionAnswer, createQuizWithQuestions,
  viewAllQuizzesByCourse, editQuiz, deleteQuiz, readFirestore
};



