// DT162G JavaScript-baserad webbutveckling
// Projektarbete
// Mittuniversitetet
// Mattias Bygdeson

// Imports
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

// Connect to database (REMOTE)
mongoose.connect("mongodb://mattias:louisianabob04@ds249623.mlab.com:49623/todolistdb", { useNewUrlParser: true });

// Read schema
var Tasks = require("./models/tasks.js");

// Create instance of express
var app = express();

// Middleware (make web service accessible from other domains)
app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
	next();
});

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Create static path
app.use(express.static(path.join(__dirname, 'public')));

// REST-API
// Get all tasks [GET]
app.get("/api/tasks", function(req, res){
    Tasks.find(function(err, Tasks){
        if(err){
            res.send(err);
        }

        res.json(Tasks);
    });
});

// Get specific task [GET(id)]
app.get("/api/tasks/:id", function(req, res){
    var ID = req.params.id;

    Tasks.findById({ _id: ID, }, function(err, Tasks){
        if(err) {
            res.send(err);
        }

        res.json(Tasks);
    });
});

// Add task [POST]
app.post("/api/tasks/add", function(req, res){
    // New instance of Tasks
    var task = new Tasks();

    // Create new object
    // task.taskId = req.body.taskId;
    task.taskBody = req.body.taskBody;
    task.taskDeadline = req.body.taskDeadline;
    task.taskComplete = req.body.taskComplete;

    // Save to database
    task.save(function(err) {
        if(err) {
            res.send(err);
        }
    });
    
    // Reload page
    res.redirect("/");
})

// Update task [PUT]
app.put("/api/tasks/update/:id", function(req, res){
    var ID = req.params.id;

    // New values
    var taskBody = req.body.taskBody;
    var taskDeadline = req.body.taskDeadline;

    Tasks.updateOne( { _id: ID }, { $set: {taskBody: taskBody, taskDeadline: taskDeadline}}, function(err, Tasks){
        if(err) {
            res.send(err);
        }

        // res.redirect("/");
        res.json({ message: "Task updated with id: " + ID });
    })
});

// Delete task [DELETE]
app.delete("/api/tasks/delete/:id", function(req, res){
    var deleteID = req.params.id;

    Tasks.deleteOne({ _id: deleteID, }, function(err, Tasks){
        if(err) {
            res.send(err);
        }

        res.json({ message: "Task removed, id: " + deleteID });
    });
});

// TCP/IP port
var port = 3000;

// Start server
app.listen(port, function(){
    console.log("Server is running at port " + port);
});