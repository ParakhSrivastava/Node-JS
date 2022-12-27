const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth')

// Creating New Tasks
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((err) => {
    //     res.status(400).send(err)
    // });
})

router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({});

        const match = {};
        // taking value from query parameters (path variables)
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        const sort = {};
        // taking value from query parameters (path variables)
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        // for populating that VIRTUAL field (tasks) in USER schema 
        // 'match' is used for filtering purpose
        // 'options' for pagination and sorting
        // 'limit' for limiting content on returning to the client
        // 'skip' for skipping content on returning to the client
        // eg: limit 2, skip 1: every page will show 2 docs and first doc will be skipped
        // eg: limit 2, skip 0: every page will show 2 docs and no doc will be skipped
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks);
    // }).catch(e => {
    //     res.status(500).send(e);
    // });
})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id });

        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

    // Task.findById(id).then((task) => {
    //     if(!task){
    //         return res.status(400).send();
    //     }
    //     res.send(task);
    // }).catch(e => {
    //     res.status(500).send(e);
    // });
})

router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates!!!'})
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        // when using middleware (for security features), use this method to update 
        // const task = await Task.findById(req.params.id);

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!task){
            return res.status(400).send();
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save();

        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task){
            return res.status(400).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router