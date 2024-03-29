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
    throw new Error('Internal Server Error');
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

    const quizzes = await readFirestore('quizzes');

    // Check if quiz title is already used
    const existingQuizWithTitle = quizzes.find(q => q.quizTitle === quizTitle);
    if (existingQuizWithTitle) {
      return res.status(409).json({ message: 'Quiz with this title already exists.' });
    }

    // Write the new quiz to Firestore
    const quizId = await writeFirestore(newQuiz.toFirestore(), 'quizzes');
    return res.status(201).json({ message: 'Quiz created successfully.', quizId });

  } catch (error) {
    //console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function viewQuestionsPerQuiz(req, res) {
  try {
    const quizId = req.params.quizId;

    // Query Firestore directly for the specific quiz
    const quizSnapshot = await db.collection('quizzes').doc(quizId).get();

    if (!quizSnapshot.exists) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quiz = quizSnapshot.data();

    return res.status(200).json({ questions: quiz.questions });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


//validate whether a question is answered correctly or not (quizId, questionId, userOptionInput)
async function validateUserAnswers(quizId, userAnswers) {
  try {
    // Fetch the quiz from Firestore
    const quizDoc = await db.collection('quizzes').doc(quizId).get();
    const quizData = quizDoc.data();


    const questions = quizData.questions;

    // Validate the number of user answers
    if (userAnswers.length !== questions.length) {
      return {
        error: 'Invalid number of answers.',
      };
    }

    let correctAnswers = 0;
    const results = [];

    // Compare each user answer with the correct option
    userAnswers.forEach((userAnswer, index) => {
      const correctOption = questions[index].correctOption;

      results.push({
        questionTitle: questions[index].questionTitle,
        userAnswer,
        correctOption: questions[index].options[correctOption],
        isCorrect: userAnswer === correctOption,
      });

      if (userAnswer === correctOption) {
        correctAnswers++;
      }
    });

    return {
      totalQuestions: questions.length,
      correctAnswers,
      results,
    };
  } catch (error) {
    // console.error('Error validating user answers:', error);
    throw new Error('Internal Server Error');
  }
}

// View all quizzes function by course
async function viewAllQuizzesByCourse(req, res) {
  try {
    const course = req.params.course;

    const allQuizzes = await readFirestore('quizzes');

    const quizzesByCourse = allQuizzes.filter(quiz => quiz.quizCourse === course);

    if (quizzesByCourse.length === 0) {
      return res.status(404).json({ message: 'No quizzes found' });
    }

    return res.status(200).json(quizzesByCourse);
  } catch (error) {
    return res.status(500).json({ message: 'Error reading from Firestore' });
  }
}
// View all quizzes function by course
async function viewQuizzesBytopic(req, res) {
  try {
    const topic = req.params.topic;

    const allQuizzes = await readFirestore('quizzes');

    const quizzesByCourse = allQuizzes.filter(quiz => quiz.quizCourse === topic);

    if (quizzesByCourse.length === 0) {
      return res.status(404).json({ message: 'No quizzes found' });
    }

    return res.status(200).json(quizzesByCourse);
  } catch (error) {
    return res.status(500).json({ message: 'Error reading from Firestore' });
  }
}

// View all quizzes function
async function viewAllQuizzes(req, res) {
  try {
    const allQuizzes = await readFirestore('quizzes');

    return res.status(200).json(allQuizzes);
  } catch (error) {
    return res.status(500).json({ message: 'Error reading from Firestore' });
  }
}

// Function to handle the editing of a quiz
async function editQuiz(req, res) {
  try {
    const { quizId } = req.params;
    const { newQuizTitle, newQuizCourse, newQuestions } = req.body;

    // Reference to the specific quiz in Firestore
    const quizRef = db.collection('quizzes').doc(quizId);

    // Fetch the existing quiz
    const doc = await quizRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check for the presence of required fields
    if (!newQuizTitle || !newQuizCourse || !newQuestions) {
      return res.status(400).json({ message: 'Missing required fields for editing quiz.' });
    }

    // Update the quiz data
    const updatedQuiz = {
      quizTitle: newQuizTitle,
      quizCourse: newQuizCourse,
      questions: newQuestions.map(question => ({
        questionTitle: question.questionTitle,
        options: question.options,
        correctOption: question.correctOption
      }))
    };

    // Update the quiz in Firestore
    await quizRef.update(updatedQuiz);

    return res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error occurred attempting to edit quiz' });
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

  viewQuestionsPerQuiz, validateUserAnswers, createQuizWithQuestions,
  viewAllQuizzesByCourse, editQuiz, deleteQuiz, viewAllQuizzes, readFirestore, writeFirestore, viewQuizzesBytopic
};



