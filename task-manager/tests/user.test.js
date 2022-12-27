const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../src/models/user');
const { response } = require('express');

const mockUserId = new mongoose.Types.ObjectId();
const mockUser = {
    _id: mockUserId,
    name: 'Parakh_1',
    email: 'killer1@gmail.com',
    password: '1234567',
    age: 21,
    tokens: [{
        token: jwt.sign({ _id: mockUserId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    // deleting DATA from test DB
    await User.deleteMany();
    await new User(mockUser).save();
})

test('Should signup a user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Parakh_2',
        email: 'killer2@gmail.com',
        password: '1234567',
        age: 21
    }).expect(201)

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body.user).toMatchObject({
        name: 'Parakh_2',
        email: 'killer2@gmail.com',
        age: 21,
    })

    expect(user.password).not.toBe('1234567');
});

test('Should login a user', async () => {
    const response = await request(app).post('/users/login').send({
        email: mockUser.email,
        password: mockUser.password
    }).expect(200)

    const user = await User.findById(mockUserId);
    expect(response.body.token).toBe(user.tokens[1].token)
});

test('Should not login a non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'killer2@gmail.com',
        password: '123'
    }).expect(400)
});

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .send()
        .expect(200)
});

test('Should not get user profile without auth', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearers ${mockUser.tokens[0].token}`)
        .send()
        .expect(401)
});

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(mockUserId);
    expect(user).toBeNull();
});

test('Should delete account for user without auth', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearers ${mockUser.tokens[0].token}`)
        .send()
        .expect(401)
});

test('Should upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    // toBe --> ===  
    // toEqual --> ==
    const user = await User.findById(mockUserId);
    expect(user.avatar).toEqual(expect.any(Buffer))
});

test('Should update valid user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .send({
            name: 'Parakh_update'
        })
        .expect(200)

    const user = await User.findById(mockUserId);
    expect(user.name).toEqual('Parakh_update')
});

test('Should not update valid user', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Parakh_update'
        })
        .expect(401)
});