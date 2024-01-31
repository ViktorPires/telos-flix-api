const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../src/config/env');
const moviesController = require('../../src/controllers/movies.controller');

jest.mock('../../src/controllers/movies.controller');

const app = express();
app.use(express.json());
app.use('/', require('../../src/routes/movies.routes'));

describe('Movies Routes', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('GET /movies/', () => {
        it('should fetch a list of movies', async () => {
            moviesController.list.mockImplementation((req, res) => res.json({ message: 'List of movies' }));
            const response = await request(app).get('/movies/');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'List of movies' });
        });
    });

    describe('GET /movies/genres', () => {
        it('should fetch a list of movie genres', async () => {
            moviesController.listGenres.mockImplementation((req, res) => res.json({ genres: ['Action', 'Drama'] }));
            const response = await request(app).get('/movies/genres');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ genres: ['Action', 'Drama'] });
        });
    });

    describe('GET /movies/:id', () => {
        it('should fetch a specific movie by id', async () => {
            moviesController.getById.mockImplementation((req, res) => res.json({ message: 'Single movie' }));
            const response = await request(app).get('/movies/123');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'Single movie' });
        });
    });

    describe('POST /movies', () => {
        it('should create a new movie', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId', role: 'admin' }, JWT_SECRET);

            moviesController.create.mockImplementation((req, res) => res.status(201).json({ message: 'Movie created' }));
            const response = await request(app)
                .post('/movies')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ title: 'Inception', genre: 'Sci-Fi' });

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({ message: 'Movie created' });
        });
    });

    describe('PUT /movies/:id', () => {
        it('should update an existing movie', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId', role: 'admin' }, JWT_SECRET);

            moviesController.update.mockImplementation((req, res) => res.json({ message: 'Movie updated' }));
            const response = await request(app)
                .put('/movies/123')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ title: 'Inception', genre: 'Sci-Fi' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: 'Movie updated' });
        });
    });

    describe('DELETE /movies/:id', () => {
        it('should delete a movie', async () => {
            const mockToken = jwt.sign({ userId: 'mockUserId', role: 'admin' }, JWT_SECRET);

            moviesController.remove.mockImplementation((req, res) => res.status(204).send());
            const response = await request(app)
                .delete('/movies/123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.statusCode).toBe(204);
        });
    });
});
