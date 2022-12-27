const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        default: 0,
        // custom validator
        validate(value) {
            if(value < 0){
                throw new Error("Age cannot be negative")
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid EMAIL!!!")
            }
        }
    },
    password: {
        type: String,
        required: false,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        },
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true  // for automatically creating CREATED_AT and UPDATED_AT timestamps as columns
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// lengthy way
// userSchema.methods.getPublicProfile = async function() {
//     const user = this;
//     // needed if modification is needed in USER model object
//     const userObject = user.toObject();    

//     delete userObject.password;
//     delete userObject.tokens;

//     return userObject;
// }

// short way
// when we call toJSON on any object, and return some object from toJSON, then that object will only get return on res.send()
// without toJSON --> res.send(anyObject) --> JSON.stringify(anyObject)
// with toJSON --> res.send(anyObject) --> JSON.stringify(toJSONResultObject)
userSchema.methods.toJSON = function() {
    const user = this;
    // needed if modification is needed in USER model object
    const userObject = user.toObject();    

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// this method will be available for all the instances of USER model
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token;
}

// Way to define LOGIN method before saving/creating new users
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });    

    if(!user){
        throw new Error('Unable to Login!')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to Login!')
    }
    return user;
}

// middleware: hashing the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete tasks when user is deleted
userSchema.pre('remove', async function(next){
    const user = this;

    await Task.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User

// const me = new User({
//     name: ' Parakh ',
//     email: ' PARAKH@gmail.com '
// });

// me.save().then((res) => {
//     console.log(res)
// }).catch((err) => {
//     console.log(err)
// });