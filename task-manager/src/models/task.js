const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        trim: true,
        required: true
    },
    completed:{
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})

taskSchema.pre('save', async function(next){
    const task = this;

    if(task.isModified('password')){
        task.password = await bcrypt.hash(task.password, 8)
    }

    next()
})

// mongo lowercases the model name: 'Task' to 'task' and the pluralizes the same: 'tasks' & then makes the collection
const Task = mongoose.model('Task', taskSchema);

module.exports = Task

// const cleanRoom = new Task({
//     description: 'Clean the room',
//     completed: true
// });

// cleanRoom.save().then((res) => {
//     console.log(res)
// }).catch((err) => {
//     console.log(err)
// });