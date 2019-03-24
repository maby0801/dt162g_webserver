// DT162G JavaScript-baserad webbutveckling
// Projektarbete
// Mittuniversitetet
// Mattias Bygdeson

// Imports
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var cors = require('cors');

// Connect to database (REMOTE)
mongoose.connect("mongodb://mattias:louisianabob04@ds249623.mlab.com:49623/todolistdb", { useNewUrlParser: true });

// Read schema
var Tasks = require("./models/tasks.js");

// Create instance of express and cors
var app = express();
app.use(cors());

// Middleware (make web service accessible from other domains)
app.all('/*', function(req, res, next) {    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
    
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
    task._id = req.body._id;
    task.title = req.body.title;
    task.completed = req.body.completed;

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
    var title = req.body.title;
    var completed = req.body.completed;
    //var taskDeadline = req.body.taskDeadline;

    Tasks.updateOne( { _id: ID }, { $set: {title: title, completed: completed}}, function(err, Tasks){
        if(err) {
            res.send(err);
        }
    })
});

// Delete task [DELETE]
app.delete("/api/tasks/delete/:id", function(req, res){
    var deleteID = req.params.id;

    Tasks.deleteOne({ _id: deleteID, }, function(err, Tasks){
        if(err) {
            res.send(err);
        }
    });
});

// TCP/IP port
var port = 8080;

// Start server
app.listen(port, function(){
    console.log("Server is running at port " + port);
});