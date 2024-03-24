const request = require('supertest');
const express = require('express');
const authenticateController = require('../../src/controllers/authenticate.controller');

jest.mock('../../src/controllers/authenticate.controller');

const app = express();
app.use(express.json());
app.use('/', require('../../src/routes/authenticate.routes'));

describe('Authenticate Routes', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('POST /authenticate', () => {
        it('should authenticate a user and return a token', async () => {
            const mockUserData = {
                userId: 'mockUserId',
                username: 'mockUsername',
                email: 'mockEmail',
                password: 'mockPassword',
                cellphone: 'mockCellphone',
                role: 'mockRole'
            };

            authenticateController.login.mockImplementation((req, res) => {
                const token = 'mockToken';
                res.status(200).json({ token });
            });

            const response = await request(app)
                .post('/authenticate')
                .send({ email: 'mockEmail', password: 'mockPassword' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ token: 'mockToken' });
        });

        it('should handle authentication failure', async () => {
            authenticateController.login.mockImplementation((req, res) => {
                res.status(401).json({ message: 'Authentication failed' });
            });

            const response = await request(app)
                .post('/authenticate')
                .send({ userEmail: 'invalidEmail', password: 'invalidPassword' });

            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({ message: 'Authentication failed' });
        });
    });
});
