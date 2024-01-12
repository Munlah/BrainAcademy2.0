var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const PORT = process.env.PORT || 5050;
var startPage = 'index.html';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public'));

// Quizzes
const {
  viewQuestionsPerQuiz,
  createQuizWithQuestions,
  // validateQuestionAnswer,
  viewAllQuizzesByCourse,
  editQuiz,
  deleteQuiz,
} = require('./utils/QuizzesUtil');

// Users
const {
  registerUser,
  getUser,
  login,
  updateUser,
  deleteUser,
} = require('./utils/UserUtil');

// Courses
const {
   addCourse, 
   // getAllCourses, 
  // getCoursesByCategory 
} = require('./utils/CourseUtil');

app.get('/view-all-questions-for-quiz/:quizId', viewQuestionsPerQuiz);
app.get('/view-all-quizzes/:course', viewAllQuizzesByCourse);
//app.get('/getcourse/:id', getCourse);
//app.get('/getcourse', getAllCourses);

// app.post(
//   '/view-all-questions-for-quiz/:quizId/:questionId/:userOptionInput',
//   validateQuestionAnswer
// );
app.post('/create-new-quiz', createQuizWithQuestions);
// app.put('/edit-quiz/:quizId', editQuiz);
app.delete('/delete-quiz/:quizId', deleteQuiz);

// app.post('/register', registerUser);
// app.get('/getUser/:username', getUser);
// app.post('/login', login);
// app.put('/updateUser/:id', updateUser);
// app.delete('/deleteUser/:id', deleteUser);

// app.post('/addCourse', addCourse);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/' + startPage);
});

const server = app.listen(PORT, function () {
  console.log(`Demo project at: ${PORT}!`);
});

module.exports = { app, server };