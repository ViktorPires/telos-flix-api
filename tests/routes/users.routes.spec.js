const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../src/config/env');
const usersController = require('../../src/controllers/users.controller');

jest.mock('../../src/controllers/users.controller');

const app = express();
app.use(express.json());
app.use('/', require('../../src/routes/users.routes'));

describe('Users Routes', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('GET /users', () => {
        it('should fetch a list of users', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId', role: 'admin' }, JWT_SECRET);

            usersController.list.mockImplementation((req, res) => res.json({ message: 'List of users' }));
            const response = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'List of users' });
        });
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            usersController.create.mockImplementation((req, res) => res.status(201).json({ message: 'User created' }));
            const response = await request(app)
                .post('/users')
                .send({ name: 'John Doe', email: 'john@example.com', password: 'password123', cellphone: '123456789' });

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({ message: 'User created' });
        });
    });

    describe('POST /users/createAdmin', () => {
        it('should create a new admin user', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId', role: 'admin' }, JWT_SECRET);

            usersController.createAdminUsers.mockImplementation((req, res) => res.status(201).json({ message: 'Admin user created' }));
            const response = await request(app)
                .post('/users/createAdmin')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ name: 'Admin User', email: 'admin@example.com', password: 'adminPassword', cellphone: '123456789', role: 'admin' });

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({ message: 'Admin user created' });
        });
    });

    describe('GET /users/:id', () => {
        it('should fetch a specific user by id', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId', role: 'admin' }, JWT_SECRET);

            usersController.getById.mockImplementation((req, res) => res.json({ message: 'Single user' }));
            const response = await request(app)
                .get('/users/123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'Single user' });
        });
    });

    describe('PUT /users/:id', () => {
        it('should update an existing user', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId' }, JWT_SECRET);

            usersController.update.mockImplementation((req, res) => res.json({ message: 'User updated' }));
            const response = await request(app)
                .put('/users/123')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ name: 'Updated User' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'User updated' });
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId' }, JWT_SECRET);

            usersController.remove.mockImplementation((req, res) => res.status(204).send());
            const response = await request(app)
                .delete('/users/123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.statusCode).toBe(204);
        });
    });
});
