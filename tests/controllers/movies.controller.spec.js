const { list, getById, listGenres, create, update, remove } = require('../../src/controllers/movies.controller');
const MovieModel = require('../../src/model/movie.model');

jest.mock('../../src/model/movie.model');

describe('Movie Controller', () => {
    const mockRequest = {};
    const mockResponse = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

    beforeEach(() => {
        mockRequest.query = {};
        mockRequest.params = {};
        mockRequest.body = {};
        mockResponse.json.mockClear();
        mockResponse.status.mockClear();
        mockResponse.send.mockClear();
    });

    describe('list function', () => {
        it('should return a list of movies without the video for users not logged', async () => {
            const mockMovies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
            const mockLimit = jest.fn().mockReturnThis();
            const mockSkip = jest.fn().mockReturnThis();
            const mockSelect = jest.fn().mockResolvedValue(mockMovies);

            MovieModel.find.mockReturnValue({
                limit: mockLimit,
                skip: mockSkip,
                select: mockSelect
            });

            mockRequest.query = { limit: 10, page: 1 };

            mockRequest.user = null;

            await list(mockRequest, mockResponse);

            expect(mockLimit).toHaveBeenCalledWith(10);
            expect(mockSkip).toHaveBeenCalledWith(0);
            expect(mockSelect).toHaveBeenCalledWith("-video");
            expect(mockResponse.json).toHaveBeenCalledWith(mockMovies);
        });
    });
    describe('getById function', () => {
        it('should return a movie by id', async () => {
            const mockMovie = { title: 'Movie 1' };
            MovieModel.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockMovie),
            });

            mockRequest.params.id = '1';
            await getById(mockRequest, mockResponse);

            expect(mockResponse.json).toHaveBeenCalledWith(mockMovie);
        });
    });

    describe('listGenres function', () => {
        it('should return a list of genres', async () => {
            const mockGenres = ['Action', 'Comedy'];
            MovieModel.distinct.mockResolvedValue(mockGenres);

            await listGenres(mockRequest, mockResponse);

            expect(mockResponse.json).toHaveBeenCalledWith(mockGenres.sort());
        });
    });

    describe('create function', () => {
        it('should create a movie', async () => {
            const newMovie = { title: 'New Movie' };
            MovieModel.create.mockResolvedValue(newMovie);

            mockRequest.body = newMovie;
            await create(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(newMovie);
        });
    });

    describe('update function', () => {
        it('should update a movie', async () => {
            const updatedMovie = { title: 'Updated Movie' };
            MovieModel.findByIdAndUpdate.mockResolvedValue(updatedMovie);

            mockRequest.params.id = '1';
            mockRequest.body = updatedMovie;
            await update(mockRequest, mockResponse);

            expect(mockResponse.json).toHaveBeenCalledWith(updatedMovie);
        });
    });

    describe('remove function', () => {
        it('should remove a movie', async () => {
            const movieRemoved = { title: 'Movie to remove' };
            MovieModel.findByIdAndDelete.mockResolvedValue(movieRemoved);

            mockRequest.params.id = '1';
            await remove(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });
    });
});