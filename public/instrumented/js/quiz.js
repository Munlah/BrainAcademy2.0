function cov_uosqh8uv9(){var path="C:\\Users\\munle\\Documents\\DVOPS_Projects\\BrainAcademy2.0\\public\\js\\quiz.js";var hash="67b92f8c3bdc3d09bd3dff3d671dda492bbe0634";var global=new Function("return this")();var gcv="__coverage__";var coverageData={path:"C:\\Users\\munle\\Documents\\DVOPS_Projects\\BrainAcademy2.0\\public\\js\\quiz.js",statementMap:{"0":{start:{line:3,column:4},end:{line:32,column:5}},"1":{start:{line:4,column:25},end:{line:4,column:87}},"2":{start:{line:5,column:21},end:{line:5,column:42}},"3":{start:{line:7,column:8},end:{line:29,column:9}},"4":{start:{line:8,column:25},end:{line:8,column:56}},"5":{start:{line:10,column:12},end:{line:26,column:15}},"6":{start:{line:11,column:17},end:{line:24,column:13}},"7":{start:{line:12,column:40},end:{line:12,column:72}},"8":{start:{line:13,column:16},end:{line:13,column:59}},"9":{start:{line:14,column:16},end:{line:14,column:59}},"10":{start:{line:15,column:16},end:{line:15,column:63}},"11":{start:{line:16,column:16},end:{line:16,column:52}},"12":{start:{line:17,column:16},end:{line:21,column:19}},"13":{start:{line:19,column:35},end:{line:19,column:52}},"14":{start:{line:20,column:20},end:{line:20,column:109}},"15":{start:{line:23,column:16},end:{line:23,column:50}},"16":{start:{line:28,column:12},end:{line:28,column:67}},"17":{start:{line:31,column:8},end:{line:31,column:64}},"18":{start:{line:35,column:0},end:{line:35,column:24}}},fnMap:{"0":{name:"getquiz",decl:{start:{line:2,column:15},end:{line:2,column:22}},loc:{start:{line:2,column:25},end:{line:33,column:1}},line:2},"1":{name:"(anonymous_1)",decl:{start:{line:10,column:33},end:{line:10,column:34}},loc:{start:{line:10,column:43},end:{line:26,column:13}},line:10},"2":{name:"(anonymous_2)",decl:{start:{line:17,column:58},end:{line:17,column:59}},loc:{start:{line:17,column:70},end:{line:21,column:17}},line:17}},branchMap:{"0":{loc:{start:{line:7,column:8},end:{line:29,column:9}},type:"if",locations:[{start:{line:7,column:8},end:{line:29,column:9}},{start:{line:7,column:8},end:{line:29,column:9}}],line:7},"1":{loc:{start:{line:11,column:17},end:{line:24,column:13}},type:"if",locations:[{start:{line:11,column:17},end:{line:24,column:13}},{start:{line:11,column:17},end:{line:24,column:13}}],line:11},"2":{loc:{start:{line:11,column:21},end:{line:11,column:64}},type:"binary-expr",locations:[{start:{line:11,column:21},end:{line:11,column:35}},{start:{line:11,column:39},end:{line:11,column:64}}],line:11}},s:{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0},f:{"0":0,"1":0,"2":0},b:{"0":[0,0],"1":[0,0],"2":[0,0]},_coverageSchema:"1a1c01bbd47fc00a2c39e90264f33305004495a9",hash:"67b92f8c3bdc3d09bd3dff3d671dda492bbe0634"};var coverage=global[gcv]||(global[gcv]={});if(!coverage[path]||coverage[path].hash!==hash){coverage[path]=coverageData;}var actualCoverage=coverage[path];{// @ts-ignore
cov_uosqh8uv9=function(){return actualCoverage;};}return actualCoverage;}cov_uosqh8uv9();async function getquiz(){cov_uosqh8uv9().f[0]++;cov_uosqh8uv9().s[0]++;try{const response=(cov_uosqh8uv9().s[1]++,await fetch(`http://localhost:5050/view-all-quizzes/${topic}`));const data=(cov_uosqh8uv9().s[2]++,await response.json());cov_uosqh8uv9().s[3]++;if(response.ok){cov_uosqh8uv9().b[0][0]++;const quiz=(cov_uosqh8uv9().s[4]++,document.getElementById('quiz'));cov_uosqh8uv9().s[5]++;data.courses.forEach(course=>{cov_uosqh8uv9().f[1]++;cov_uosqh8uv9().s[6]++;if((cov_uosqh8uv9().b[2][0]++,course.quizIds)&&(cov_uosqh8uv9().b[2][1]++,course.quizIds.length>0)){cov_uosqh8uv9().b[1][0]++;const startQuizButton=(cov_uosqh8uv9().s[7]++,document.createElement('button'));cov_uosqh8uv9().s[8]++;startQuizButton.textContent='Start Quiz';cov_uosqh8uv9().s[9]++;startQuizButton.style.borderRadius='4px';cov_uosqh8uv9().s[10]++;startQuizButton.classList.add('normal-button');cov_uosqh8uv9().s[11]++;startQuizButton.id='redirectQuiz';cov_uosqh8uv9().s[12]++;startQuizButton.addEventListener('click',function(){cov_uosqh8uv9().f[2]++;// Redirect to another page
const quizId=(cov_uosqh8uv9().s[13]++,course.quizIds[0]);// Assuming only one quiz for simplicity
cov_uosqh8uv9().s[14]++;window.location.href=`http://127.0.0.1:5500/public/validateQuiz.html?quizId=${quizId}`;});cov_uosqh8uv9().s[15]++;quiz.appendChild(startQuizButton);}else{cov_uosqh8uv9().b[1][1]++;}//coursesGrid.appendChild(topicBox);
});}else{cov_uosqh8uv9().b[0][1]++;cov_uosqh8uv9().s[16]++;console.error('Error fetching courses:',data.message);}}catch(error){cov_uosqh8uv9().s[17]++;console.error('Error fetching courses:',error.message);}}cov_uosqh8uv9().s[18]++;window.onload=getquiz;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfdW9zcWg4dXY5IiwiYWN0dWFsQ292ZXJhZ2UiLCJnZXRxdWl6IiwiZiIsInMiLCJyZXNwb25zZSIsImZldGNoIiwidG9waWMiLCJkYXRhIiwianNvbiIsIm9rIiwiYiIsInF1aXoiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY291cnNlcyIsImZvckVhY2giLCJjb3Vyc2UiLCJxdWl6SWRzIiwibGVuZ3RoIiwic3RhcnRRdWl6QnV0dG9uIiwiY3JlYXRlRWxlbWVudCIsInRleHRDb250ZW50Iiwic3R5bGUiLCJib3JkZXJSYWRpdXMiLCJjbGFzc0xpc3QiLCJhZGQiLCJpZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJxdWl6SWQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJhcHBlbmRDaGlsZCIsImNvbnNvbGUiLCJlcnJvciIsIm1lc3NhZ2UiLCJvbmxvYWQiXSwic291cmNlcyI6WyJxdWl6LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5hc3luYyBmdW5jdGlvbiBnZXRxdWl6KCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjUwNTAvdmlldy1hbGwtcXVpenplcy8ke3RvcGljfWApO1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICBjb25zdCBxdWl6ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1aXonKTtcclxuXHJcbiAgICAgICAgICAgIGRhdGEuY291cnNlcy5mb3JFYWNoKGNvdXJzZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgaWYgKGNvdXJzZS5xdWl6SWRzICYmIGNvdXJzZS5xdWl6SWRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0UXVpekJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRRdWl6QnV0dG9uLnRleHRDb250ZW50ID0gJ1N0YXJ0IFF1aXonO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRRdWl6QnV0dG9uLnN0eWxlLmJvcmRlclJhZGl1cyA9ICc0cHgnO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRRdWl6QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ25vcm1hbC1idXR0b24nKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0UXVpekJ1dHRvbi5pZCA9ICdyZWRpcmVjdFF1aXonO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRRdWl6QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlZGlyZWN0IHRvIGFub3RoZXIgcGFnZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1aXpJZCA9IGNvdXJzZS5xdWl6SWRzWzBdOyAvLyBBc3N1bWluZyBvbmx5IG9uZSBxdWl6IGZvciBzaW1wbGljaXR5XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgaHR0cDovLzEyNy4wLjAuMTo1NTAwL3B1YmxpYy92YWxpZGF0ZVF1aXouaHRtbD9xdWl6SWQ9JHtxdWl6SWR9YDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHF1aXouYXBwZW5kQ2hpbGQoc3RhcnRRdWl6QnV0dG9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9jb3Vyc2VzR3JpZC5hcHBlbmRDaGlsZCh0b3BpY0JveCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIGNvdXJzZXM6JywgZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIGNvdXJzZXM6JywgZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5vbmxvYWQgPSBnZXRxdWl6O1xyXG4iXSwibWFwcGluZ3MiOiJzMUZBZVk7QUFBQUEsYUFBQSxTQUFBQSxDQUFBLFNBQUFDLGNBQUEsV0FBQUEsY0FBQSxFQUFBRCxhQUFBLEdBZFosY0FBZSxDQUFBRSxPQUFPQSxDQUFBLENBQUcsQ0FBQUYsYUFBQSxHQUFBRyxDQUFBLE1BQUFILGFBQUEsR0FBQUksQ0FBQSxNQUNyQixHQUFJLENBQ0EsS0FBTSxDQUFBQyxRQUFRLEVBQUFMLGFBQUEsR0FBQUksQ0FBQSxNQUFHLEtBQU0sQ0FBQUUsS0FBSyxDQUFFLDBDQUF5Q0MsS0FBTSxFQUFDLENBQUMsRUFDL0UsS0FBTSxDQUFBQyxJQUFJLEVBQUFSLGFBQUEsR0FBQUksQ0FBQSxNQUFHLEtBQU0sQ0FBQUMsUUFBUSxDQUFDSSxJQUFJLENBQUMsQ0FBQyxFQUFDVCxhQUFBLEdBQUFJLENBQUEsTUFFbkMsR0FBSUMsUUFBUSxDQUFDSyxFQUFFLENBQUUsQ0FBQVYsYUFBQSxHQUFBVyxDQUFBLFNBQ2IsS0FBTSxDQUFBQyxJQUFJLEVBQUFaLGFBQUEsR0FBQUksQ0FBQSxNQUFHUyxRQUFRLENBQUNDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBQ2QsYUFBQSxHQUFBSSxDQUFBLE1BRTdDSSxJQUFJLENBQUNPLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDQyxNQUFNLEVBQUksQ0FBQWpCLGFBQUEsR0FBQUcsQ0FBQSxNQUFBSCxhQUFBLEdBQUFJLENBQUEsTUFDMUIsR0FBSSxDQUFBSixhQUFBLEdBQUFXLENBQUEsU0FBQU0sTUFBTSxDQUFDQyxPQUFPLElBQUFsQixhQUFBLEdBQUFXLENBQUEsU0FBSU0sTUFBTSxDQUFDQyxPQUFPLENBQUNDLE1BQU0sQ0FBRyxDQUFDLEVBQUUsQ0FBQW5CLGFBQUEsR0FBQVcsQ0FBQSxTQUNsRCxLQUFNLENBQUFTLGVBQWUsRUFBQXBCLGFBQUEsR0FBQUksQ0FBQSxNQUFHUyxRQUFRLENBQUNRLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBQ3JCLGFBQUEsR0FBQUksQ0FBQSxNQUN6RGdCLGVBQWUsQ0FBQ0UsV0FBVyxDQUFHLFlBQVksQ0FBQ3RCLGFBQUEsR0FBQUksQ0FBQSxNQUMzQ2dCLGVBQWUsQ0FBQ0csS0FBSyxDQUFDQyxZQUFZLENBQUcsS0FBSyxDQUFDeEIsYUFBQSxHQUFBSSxDQUFBLE9BQzNDZ0IsZUFBZSxDQUFDSyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQzFCLGFBQUEsR0FBQUksQ0FBQSxPQUMvQ2dCLGVBQWUsQ0FBQ08sRUFBRSxDQUFHLGNBQWMsQ0FBQzNCLGFBQUEsR0FBQUksQ0FBQSxPQUNwQ2dCLGVBQWUsQ0FBQ1EsZ0JBQWdCLENBQUMsT0FBTyxDQUFFLFVBQVksQ0FBQTVCLGFBQUEsR0FBQUcsQ0FBQSxNQUNsRDtBQUNBLEtBQU0sQ0FBQTBCLE1BQU0sRUFBQTdCLGFBQUEsR0FBQUksQ0FBQSxPQUFHYSxNQUFNLENBQUNDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUFBbEIsYUFBQSxHQUFBSSxDQUFBLE9BQ2xDMEIsTUFBTSxDQUFDQyxRQUFRLENBQUNDLElBQUksQ0FBSSx5REFBd0RILE1BQU8sRUFBQyxDQUM1RixDQUFDLENBQUMsQ0FBQzdCLGFBQUEsR0FBQUksQ0FBQSxPQUVIUSxJQUFJLENBQUNxQixXQUFXLENBQUNiLGVBQWUsQ0FBQyxDQUNyQyxDQUFDLEtBQUFwQixhQUFBLEdBQUFXLENBQUEsVUFDRztBQUNKLENBQUMsQ0FBQyxDQUNOLENBQUMsSUFBTSxDQUFBWCxhQUFBLEdBQUFXLENBQUEsU0FBQVgsYUFBQSxHQUFBSSxDQUFBLE9BQ0g4QixPQUFPLENBQUNDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBRTNCLElBQUksQ0FBQzRCLE9BQU8sQ0FBQyxDQUMxRCxDQUNKLENBQUUsTUFBT0QsS0FBSyxDQUFFLENBQUFuQyxhQUFBLEdBQUFJLENBQUEsT0FDWjhCLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDLHlCQUF5QixDQUFFQSxLQUFLLENBQUNDLE9BQU8sQ0FBQyxDQUMzRCxDQUNKLENBQUNwQyxhQUFBLEdBQUFJLENBQUEsT0FFRDBCLE1BQU0sQ0FBQ08sTUFBTSxDQUFHbkMsT0FBTyJ9