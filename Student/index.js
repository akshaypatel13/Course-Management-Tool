const serverless = require('serverless-http');
const express = require('express');
const mysql = require('mysql');
const { stringify } = require('querystring');
const { isBoolean } = require('util');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

const con = mysql.createPool({
    connectionLimit: 100,
    waitForConnections: true,
    queueLimit: 0,
    host: '***************',
    user: '***********',
    password: '******************',
    port: '3306',
    database: 'project_Student',
    debug: true,
    wait_timeout: 28800,
    connect_timeout: 10
});


app.get(['/viewCourses/:studentId'], (req, res) => {
    
    var studentId = req.params.studentId;
    console.log(studentId);
    var requestPromiseCoursesResponse = require('request-promise');
		var optionsCoursesResponse = {
			method: "post",
            uri: "http://instructor-dev.us-east-1.elasticbeanstalk.com/getCoursesByStudentId",
            body: {
             studentId: studentId
            },
			json: true,
		};
		requestPromiseCoursesResponse(optionsCoursesResponse).then(function (response) {
            if(response.courses == "")
            {
            var output = 'Not Enrolled in any course';
            res.render( "error1",{ result: output});
            }
            else{
                res.render("viewCourses", { courses: response.courses });
            }
		}).catch(function (error) {
			console.log(error);
			res.json(error);
		});
   });

   app.post(['/dropCourse/:studentId/:courseId'], (req, res) => {
    var courseId = req.params.courseId;
    var studentId = req.params.studentId;
    var requestPromiseAnnouncementResponse = require('request-promise');
    var optionsAnnouncementResponse = {
        method: "post",
        uri: "http://instructor-dev.us-east-1.elasticbeanstalk.com/deleteStudent",
        body: {
            studentId:studentId,
            courseId: courseId
        },
        json: true,
    };
    requestPromiseAnnouncementResponse(optionsAnnouncementResponse).then(function (response) {
        res.redirect(`/dev/viewCourses/${studentId}`);
    }).catch(function (error) {
        console.log(error);
       res.json(error);
    });
    
});

app.post(['/viewAnnouncement/:studentId/:courseId'], (req, res) => {
    var courseId = req.params.courseId;
    var studentId = req.params.studentId;
    var requestPromiseAnnouncementResponse = require('request-promise');
    var optionsAnnouncementResponse = {
        method: "post",
        uri: "http://instructor-dev.us-east-1.elasticbeanstalk.com/getAnnouncements",
        body: {
            courseId: courseId
        },
        json: true,
    };
    requestPromiseAnnouncementResponse(optionsAnnouncementResponse).then(function (response) {
        if(response.announcemnets == "")
        {
        var output = 'No announcement found';
        res.render("error2", { page: "announcement", result: output,studentId:studentId });
        }
        else{
            res.render("viewAnnouncement", { courses: response.announcemnets,studentId:studentId});
        }
    }).catch(function (error) {
        console.log(error);
       res.json(error);
    });
    
});

app.get(['/', '/register'], (req, res) => {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
res.header('Access-Control-Allow-Headers', 'Content-Type');
res.render("register")
});

app.post('/signup', (req, res) => {
    var studentId = req.body.studentId;
    var email = req.body.email;
    var password = req.body.password;

    var sql = `SELECT * FROM signup WHERE studentId = '${studentId}'`;
    var sqlint = 'INSERT INTO signup SET ?';
    const input = { studentId: studentId, email: email, password: password };
    var querySelect = con.query(sql, (err, result) => {
        if (result == "") {
            var query = con.query(sqlint, input, (err) => {
                if (err) {
                    res.json(err);
                    throw err;
                }
                res.redirect('/dev/signin');
            });
        }
        else {
            var output = 'user already exists';
            res.render("error", { page: "signup", result: output });
        }

    });
});

app.get('/signin', (req, res) => {
    res.render("login")
});

app.post('/login', (req, res) => {
    var studentId = req.body.studentId;
    var password = req.body.password;

    var sql = `SELECT * FROM signup WHERE studentId = '${studentId}' and password = '${password}'`;
    var querySelect = con.query(sql, (err, result) => {
        if (result == "") {
            var output = 'user not found!!!!';
            res.render("error", { page: "login", result: output });
        

        }
        else {
            // res.redirect('/dev/register');
            res.redirect(`/dev/viewCourses/${studentId}`);
        }
    });
});

app.listen(1337);
module.exports.handler = serverless(app); 
