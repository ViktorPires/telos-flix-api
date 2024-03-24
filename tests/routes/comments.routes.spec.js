const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../src/config/env');
const commentsController = require('../../src/controllers/comments.controller');


jest.mock('../../src/controllers/comments.controller');

const app = express();
app.use(express.json());
app.use('/', require('../../src/routes/comments.routes'));

describe('Comments Routes', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('GET /comments', () => {
        it('should fetch all comments', async () => {
            commentsController.list.mockImplementation((req, res) => res.json({ message: 'All comments' }));
            const response = await request(app).get('/comments');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'All comments' });
        });
    });

    describe('GET /comments/movie/:movie_id', () => {
        it('should fetch comments for a specific movie', async () => {
            commentsController.listCommentsByMovie.mockImplementation((req, res) => res.json({ message: 'Comments for movie' }));
            const response = await request(app).get('/comments/movie/1');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'Comments for movie' });
        });
    });

    describe('GET /comments/:id', () => {
        it('should fetch a specific comment by id', async () => {
            commentsController.getById.mockImplementation((req, res) => res.json({ message: 'Single comment' }));
            const response = await request(app).get('/comments/123');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'Single comment' });
        });
    });

    describe('POST /comments/movie/:movie_id', () => {
        it('should create a new comment for a movie', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId' }, JWT_SECRET);

            commentsController.create.mockImplementation((req, res) => res.status(201).json({ message: 'Comment created' }));
            const response = await request(app)
                .post('/comments/movie/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ text: 'Great movie!' });

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({ message: 'Comment created' });
        });
    });
    
    describe('PUT /comments/:id', () => {
        it('should update an existing comment', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId' }, JWT_SECRET);

            commentsController.update.mockImplementation((req, res) => res.json({ message: 'Comment updated' }));
            const response = await request(app)
                .put('/comments/123')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ text: 'Updated comment' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'Comment updated' });
        });
    });

    describe('DELETE /comments/:id', () => {
        it('should delete a comment', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId', role: 'admin' }, JWT_SECRET);

            commentsController.remove.mockImplementation((req, res) => res.status(204).send());
            const response = await request(app)
                .delete('/comments/123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.statusCode).toBe(204);
        });
    });
});
