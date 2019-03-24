// DT162G JavaScript-baserad webbutveckling
// Projektarbete
// Mittuniversitetet
// Mattias Bygdeson

// Database schema for courses
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tasksSchema = new Schema({
    _id: String,
    title: String,
    completed: Boolean
});

module.exports = mongoose.model("Tasks", tasksSchema);