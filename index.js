var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(cors());

const PORT = process.env.PORT || 5050;
var startPage = 'index.html';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public'));

// Quizzes
const {
  viewQuestionsPerQuiz,
  createQuizWithQuestions,
  validateUserAnswers, viewAllQuizzesByCourse,
  editQuiz,
  deleteQuiz,
  viewAllQuizzes
} = require('./utils/QuizzesUtil');

// Users
const {
  registerUser,
  getUser,
  login,
  deleteUser,
} = require('./utils/UserUtil');

// Courses
const {
  addCourse,
  getAllCourses,
  getCourseById
} = require('./utils/CourseUtil');

app.get('/view-all-questions-for-quiz/:quizId', viewQuestionsPerQuiz);


app.post('/validate-answers', async (req, res) => {
  try {
    const { quizId, userAnswers } = req.body;
    const result = await validateUserAnswers(quizId, userAnswers);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/create-new-quiz', createQuizWithQuestions);
app.put('/edit-quiz/:quizId', editQuiz);
app.delete('/delete-quiz/:quizId', deleteQuiz);
app.get('/get-all-quizzes', viewAllQuizzes)
app.get('/view-all-quizzes/:course', viewAllQuizzesByCourse);


app.post('/register', registerUser);
app.get('/getUser/:username', getUser);
app.post('/login', login);
app.delete('/deleteUser/:userId', deleteUser);

app.post('/addCourse', addCourse);
app.get('/getAllCourses', getAllCourses);
app.get('/getcourse/:id', getCourseById);



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/' + startPage);
});

const server = app.listen(PORT, function () {
  console.log(`Demo project at: ${PORT}!`);
});

module.exports = { app, server };