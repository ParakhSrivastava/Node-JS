const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth')
const multer = require('multer');
const { sendEmail } = require('../emails/account')

// Creating New Users
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((err) => {
    //     res.status(400).send(err)
    // });
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken()
        // const modifiedUser = await user.getPublicProfile()

        res.send({ user, token: token });
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save()
        res.send({});
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send({});
    } catch (e) {
        res.status(400).send()
    }
})

// Getting Users
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

    // try {
    //     const users = await User.find({});
    //     res.send(users);
    // } catch (e) {
    //     res.status(500).send(e);
    // }

    // User.find({}).then((users) => {
    //     res.send(users);
    // }).catch(e => {
    //     res.status(500).send(e);
    // });
})

// not needed now
// router.get('/user/:id', async (req, res) => {
//     const id = req.params.id
//     try {
//         const user = await User.findById(id)
//         if(!user){
//             return res.status(400).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }

    // User.findById(id).then((user) => {
    //     if(!user){
    //         return res.status(400).send();
    //     }
    //     res.send(user);
    // }).catch(e => {
    //     res.status(500).send(e);
    // });
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates!!!'})
    }

    try {
        // when using middleware (for security features), use this method to update 
        // const user = await User.findById(req.params.id);
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        // if(!user){
        //     return res.status(400).send();
        // }
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(400).send();
        // }

        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})

// needed for storing avatar as Buffer file
const storage = multer.memoryStorage()
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000 // restricting file size to 1MB
    },
    fileFilter(req, file, callBack) {
        // REGEX: must be inside //
        // REGEX: \.jpg$ means string that includes .jpg(\.jpg) at last($)
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            // callBack(): first arg is error if occured, second arg is true when no error, false when failing silently
            return callBack(new Error('File must be a JPG, JPEG, PNG'))
        }
        callBack(undefined, true)
    },
    storage
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    // for error handling
    res.status(400).send({ error: error.message })
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar)
    } catch(e) {
        res.status(400).send();
    }
})

module.exports = router