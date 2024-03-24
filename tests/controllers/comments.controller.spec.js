const { list } = require('../../src/controllers/comments.controller');
const CommentModel = require('../../src/model/comment.model');
const commentsController = require('../../src/controllers/comments.controller');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/model/comment.model');

afterEach(() => {
    jest.clearAllMocks();
});

describe('Comment Controller - list', () => {
    it('should return a list of comments', async () => {
        expect.assertions(4);

        const comments = [
            { _id: '1', content: 'Great movie!', user_id: 'user1', movie_id: 'movie1' },
            { _id: '2', content: 'Not bad', user_id: 'user2', movie_id: 'movie2' }
        ];

        CommentModel.find.mockResolvedValue(comments);

        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/comments',
        });

        const response = httpMocks.createResponse();

        await list(request, response);

        expect(typeof response._getJSONData).toBe('function');
        const responseData = response._getJSONData();

        expect(CommentModel.find).toBeCalled();
        expect(response.statusCode).toBe(200);
        expect(responseData).toEqual(comments);
    });

    describe('Comment Controller - listCommentsByMovie', () => {
        it('should return a list of comments for a given movie', async () => {
            const movie_id = 'movie1';
            const comments = [
                { _id: '1', content: 'Great movie', user_id: 'user1', movie_id: movie_id }
            ];
            CommentModel.find.mockResolvedValue(comments);
            const request = httpMocks.createRequest({
                method: 'GET',
                url: `/comments/movie/${movie_id}`,
                params: { movie_id: movie_id }
            });
            const response = httpMocks.createResponse();
            await commentsController.listCommentsByMovie(request, response);
            const responseData = response._getJSONData();
            expect(CommentModel.find).toHaveBeenCalledWith({ movie_id: movie_id });
            expect(response.statusCode).toBe(200);
            expect(responseData).toEqual(comments);
        });
    });

    describe('Comment Controller - getById', () => {
        it('should return a comment by id', async () => {
            const commentId = '1';
            const comment = { _id: commentId, content: 'Good movie', user_id: 'user1', movie_id: 'movie1' };
            CommentModel.findById.mockResolvedValue(comment);
            const request = httpMocks.createRequest({
                method: 'GET',
                url: `/comments/${commentId}`,
                params: { id: commentId }
            });
            const response = httpMocks.createResponse();
            await commentsController.getById(request, response);
            const responseData = response._getJSONData();
            expect(CommentModel.findById).toHaveBeenCalledWith(commentId);
            expect(response.statusCode).toBe(200);
            expect(responseData).toEqual(comment);
        });
    });
});