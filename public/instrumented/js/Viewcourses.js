function cov_20wj5cz5x1(){var path="C:\\Users\\munle\\Documents\\DVOPS_Projects\\Brain_Academy_2.0\\public\\js\\Viewcourses.js";var hash="e5b91f9ce596d845c1148723283161bddf467635";var global=new Function("return this")();var gcv="__coverage__";var coverageData={path:"C:\\Users\\munle\\Documents\\DVOPS_Projects\\Brain_Academy_2.0\\public\\js\\Viewcourses.js",statementMap:{"0":{start:{line:3,column:4},end:{line:42,column:5}},"1":{start:{line:4,column:25},end:{line:4,column:75}},"2":{start:{line:5,column:21},end:{line:5,column:42}},"3":{start:{line:7,column:8},end:{line:39,column:9}},"4":{start:{line:8,column:32},end:{line:8,column:70}},"5":{start:{line:10,column:12},end:{line:36,column:15}},"6":{start:{line:11,column:33},end:{line:11,column:62}},"7":{start:{line:12,column:16},end:{line:12,column:49}},"8":{start:{line:13,column:16},end:{line:13,column:52}},"9":{start:{line:21,column:16},end:{line:32,column:19}},"10":{start:{line:22,column:37},end:{line:22,column:46}},"11":{start:{line:23,column:34},end:{line:23,column:46}},"12":{start:{line:24,column:20},end:{line:24,column:39}},"13":{start:{line:27,column:44},end:{line:27,column:72}},"14":{start:{line:28,column:41},end:{line:28,column:66}},"15":{start:{line:31,column:20},end:{line:31,column:143}},"16":{start:{line:35,column:16},end:{line:35,column:50}},"17":{start:{line:38,column:12},end:{line:38,column:67}},"18":{start:{line:41,column:8},end:{line:41,column:64}},"19":{start:{line:45,column:0},end:{line:45,column:30}}},fnMap:{"0":{name:"getAllCourses",decl:{start:{line:2,column:15},end:{line:2,column:28}},loc:{start:{line:2,column:31},end:{line:43,column:1}},line:2},"1":{name:"(anonymous_1)",decl:{start:{line:10,column:33},end:{line:10,column:34}},loc:{start:{line:10,column:43},end:{line:36,column:13}},line:10},"2":{name:"(anonymous_2)",decl:{start:{line:21,column:51},end:{line:21,column:52}},loc:{start:{line:21,column:57},end:{line:32,column:17}},line:21}},branchMap:{"0":{loc:{start:{line:7,column:8},end:{line:39,column:9}},type:"if",locations:[{start:{line:7,column:8},end:{line:39,column:9}},{start:{line:7,column:8},end:{line:39,column:9}}],line:7}},s:{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0},f:{"0":0,"1":0,"2":0},b:{"0":[0,0]},_coverageSchema:"1a1c01bbd47fc00a2c39e90264f33305004495a9",hash:"e5b91f9ce596d845c1148723283161bddf467635"};var coverage=global[gcv]||(global[gcv]={});if(!coverage[path]||coverage[path].hash!==hash){coverage[path]=coverageData;}var actualCoverage=coverage[path];{// @ts-ignore
cov_20wj5cz5x1=function(){return actualCoverage;};}return actualCoverage;}cov_20wj5cz5x1();async function getAllCourses(){cov_20wj5cz5x1().f[0]++;cov_20wj5cz5x1().s[0]++;try{const response=(cov_20wj5cz5x1().s[1]++,await fetch('http://localhost:5050/getAllCourses'));const data=(cov_20wj5cz5x1().s[2]++,await response.json());cov_20wj5cz5x1().s[3]++;if(response.ok){cov_20wj5cz5x1().b[0][0]++;const coursesGrid=(cov_20wj5cz5x1().s[4]++,document.getElementById('coursesGrid'));cov_20wj5cz5x1().s[5]++;data.courses.forEach(course=>{cov_20wj5cz5x1().f[1]++;const topicBox=(cov_20wj5cz5x1().s[6]++,document.createElement('div'));cov_20wj5cz5x1().s[7]++;topicBox.className='topic-box';cov_20wj5cz5x1().s[8]++;topicBox.textContent=course.topic;// // Add click event to navigate to details page
// topicBox.addEventListener('click', () => {
//     window.location.href = `http://127.0.0.1:5500/public/courseDetails.html?courseId=${course.id}`;
// });
// Assuming course is an object with properties like id and topic
// Add click event to navigate to details page
cov_20wj5cz5x1().s[9]++;topicBox.addEventListener('click',()=>{cov_20wj5cz5x1().f[2]++;const courseId=(cov_20wj5cz5x1().s[10]++,course.id);const topic=(cov_20wj5cz5x1().s[11]++,course.topic);cov_20wj5cz5x1().s[12]++;console.log(topic);// Encode the parameters to ensure they are properly formatted in the URL
const encodedCourseId=(cov_20wj5cz5x1().s[13]++,encodeURIComponent(courseId));const encodedTopic=(cov_20wj5cz5x1().s[14]++,encodeURIComponent(topic));// Update the URL to include both course ID and topic
cov_20wj5cz5x1().s[15]++;window.location.href=`http://127.0.0.1:5500/public/courseDetails.html?courseId=${encodedCourseId}&topic=${encodedTopic}`;});cov_20wj5cz5x1().s[16]++;coursesGrid.appendChild(topicBox);});}else{cov_20wj5cz5x1().b[0][1]++;cov_20wj5cz5x1().s[17]++;console.error('Error fetching courses:',data.message);}}catch(error){cov_20wj5cz5x1().s[18]++;console.error('Error fetching courses:',error.message);}}cov_20wj5cz5x1().s[19]++;window.onload=getAllCourses;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMjB3ajVjejV4MSIsImFjdHVhbENvdmVyYWdlIiwiZ2V0QWxsQ291cnNlcyIsImYiLCJzIiwicmVzcG9uc2UiLCJmZXRjaCIsImRhdGEiLCJqc29uIiwib2siLCJiIiwiY291cnNlc0dyaWQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY291cnNlcyIsImZvckVhY2giLCJjb3Vyc2UiLCJ0b3BpY0JveCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJ0ZXh0Q29udGVudCIsInRvcGljIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvdXJzZUlkIiwiaWQiLCJjb25zb2xlIiwibG9nIiwiZW5jb2RlZENvdXJzZUlkIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZW5jb2RlZFRvcGljIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiYXBwZW5kQ2hpbGQiLCJlcnJvciIsIm1lc3NhZ2UiLCJvbmxvYWQiXSwic291cmNlcyI6WyJWaWV3Y291cnNlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsQ291cnNlcygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cDovL2xvY2FsaG9zdDo1MDUwL2dldEFsbENvdXJzZXMnKTtcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgY29uc3QgY291cnNlc0dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY291cnNlc0dyaWQnKTtcclxuXHJcbiAgICAgICAgICAgIGRhdGEuY291cnNlcy5mb3JFYWNoKGNvdXJzZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b3BpY0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgdG9waWNCb3guY2xhc3NOYW1lID0gJ3RvcGljLWJveCc7XHJcbiAgICAgICAgICAgICAgICB0b3BpY0JveC50ZXh0Q29udGVudCA9IGNvdXJzZS50b3BpYztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAvLyBBZGQgY2xpY2sgZXZlbnQgdG8gbmF2aWdhdGUgdG8gZGV0YWlscyBwYWdlXHJcbiAgICAgICAgICAgICAgICAvLyB0b3BpY0JveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGBodHRwOi8vMTI3LjAuMC4xOjU1MDAvcHVibGljL2NvdXJzZURldGFpbHMuaHRtbD9jb3Vyc2VJZD0ke2NvdXJzZS5pZH1gO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgICAgICAvLyBBc3N1bWluZyBjb3Vyc2UgaXMgYW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyBsaWtlIGlkIGFuZCB0b3BpY1xyXG4gICAgICAgICAgICAgICAgLy8gQWRkIGNsaWNrIGV2ZW50IHRvIG5hdmlnYXRlIHRvIGRldGFpbHMgcGFnZVxyXG4gICAgICAgICAgICAgICAgdG9waWNCb3guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY291cnNlSWQgPSBjb3Vyc2UuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSBjb3Vyc2UudG9waWM7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codG9waWMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBFbmNvZGUgdGhlIHBhcmFtZXRlcnMgdG8gZW5zdXJlIHRoZXkgYXJlIHByb3Blcmx5IGZvcm1hdHRlZCBpbiB0aGUgVVJMXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5jb2RlZENvdXJzZUlkID0gZW5jb2RlVVJJQ29tcG9uZW50KGNvdXJzZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmNvZGVkVG9waWMgPSBlbmNvZGVVUklDb21wb25lbnQodG9waWMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIFVSTCB0byBpbmNsdWRlIGJvdGggY291cnNlIElEIGFuZCB0b3BpY1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYGh0dHA6Ly8xMjcuMC4wLjE6NTUwMC9wdWJsaWMvY291cnNlRGV0YWlscy5odG1sP2NvdXJzZUlkPSR7ZW5jb2RlZENvdXJzZUlkfSZ0b3BpYz0ke2VuY29kZWRUb3BpY31gO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGNvdXJzZXNHcmlkLmFwcGVuZENoaWxkKHRvcGljQm94KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgY291cnNlczonLCBkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgY291cnNlczonLCBlcnJvci5tZXNzYWdlKTtcclxuICAgIH1cclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9IGdldEFsbENvdXJzZXM7XHJcbiJdLCJtYXBwaW5ncyI6IjBnRkFlWTtBQUFBQSxjQUFBLFNBQUFBLENBQUEsU0FBQUMsY0FBQSxXQUFBQSxjQUFBLEVBQUFELGNBQUEsR0FkWixjQUFlLENBQUFFLGFBQWFBLENBQUEsQ0FBRyxDQUFBRixjQUFBLEdBQUFHLENBQUEsTUFBQUgsY0FBQSxHQUFBSSxDQUFBLE1BQzNCLEdBQUksQ0FDQSxLQUFNLENBQUFDLFFBQVEsRUFBQUwsY0FBQSxHQUFBSSxDQUFBLE1BQUcsS0FBTSxDQUFBRSxLQUFLLENBQUMs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