const app = require('./app');

// const express = require('express');
// to connect mongodb via mongoose initially
// require('./db/mongoose');
// const userRouter = require('./routers/users');
// const taskRouter = require('./routers/tasks');

const port = process.env.PORT;

// library to deal with multipart files
// const multer = require('multer');
// for mentioning destination folder for the images those has been uploaded
// const upload = multer({
//     dest: 'images'
// })
// single() will look for 'upload' key in request and take its value as a file
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// })

// Middleware: will run before Routers (using auth.js for this now)
// app.use((req, res, next) => {
//     console.log(req.method, req.path)
//     next()
// })

// to parse JSON coming from request body
// app.use(express.json())

// configuring Router with App
// app.use(userRouter);
// app.use(taskRouter);

app.listen(port, () => {
    console.log("Server is up on:", port);
})


// Without Middleware: new Request --> Router
// With Middleware: new Request --> do something / add condition for running router --> Router

// const test = async () => {
//     const password = 'Red123@';
//     // second parameter is of Number of rounds this algo will work
//     const hash = await bcrypt.hash(password, 8)

//     const isMatch = await bcrypt.compare(password, hash)
//     console.log(isMatch);
// }
// test();

// const jwt = require('jsonwebtoken');
// const test = async () => {
//     // take 2 args: field which will used as unique identifier, and some unique string
//     const token = jwt.sign({ _id: 'abc123' }, 'anyuniquestring', { expiresIn: '1 seconds' });
//     console.log("TOKEN: ", token)

//     // verifying token
//     const data = jwt.verify(token, 'anyuniquestring');
//     // const data2 = jwt.verify(token, 'anyuniquestrin');
//     console.log("DATA: ", data)
// }
// test();

// encyption algo: 2-way street, can get back the password from decrypted one
// hashing algo: 1-way street, cannot get back the password from decrypted one