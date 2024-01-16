//function to get all quizzes
function getQuizzesData() { 
  var request = new XMLHttpRequest(); 
  request.open('GET', movie_url, true); 
  //This function will be called when data returns from the web api 
  request.onload = function () { 
      //get all the movies records into our movie array 
      movie_array = JSON.parse(request.responseText); 
      //Fetch the comments as well 
      fetchComments(); 
      console.log(movie_array) // output to console 
      //call the function so as to display all movies tiles for "Now Showing" 
      displayMovies(category); 
  }; 
  //This command starts the calling of the movies web api 
  request.send(); 
} 


//function to display quizzes in list view