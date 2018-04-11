var mongoose = require('mongoose');

// model for single Todo task
let Todo = mongoose.model('Todo', { // string here is the name of collection, 
  text: {                           // mongoose takes it, lowercase it, and add s at the end ==> 
    type: String,                   // Todo = todos
    required: true,                 // thats how it knows which collection to query
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {Todo};