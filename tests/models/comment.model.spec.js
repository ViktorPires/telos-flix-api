const mongoose = require('mongoose');

const { MONGO_TEST_DB_URI } = require('../../src/config/env');
const Comment = require('../../src/model/comment.model');

describe('Comment Model', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_TEST_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new comment', async () => {
        const validUserId = new mongoose.Types.ObjectId();
        const validMovieId = new mongoose.Types.ObjectId();

        const validComment = new Comment({
            user_id: validUserId,
            movie_id:  validMovieId,
            content: 'This is a valid comment.',
            rating: 4,
        });
        const savedComment = await validComment.save();

        expect(savedComment._id).toBeDefined();
        expect(savedComment.user_id).toEqual(validUserId);
        expect(savedComment.movie_id).toEqual(validMovieId);
        expect(savedComment.content).toBe('This is a valid comment.');
        expect(savedComment.rating).toBe(4);
    });

    it('should not save comment without required fields', async () => {
        const invalidComment = new Comment({});

        let err;
        try {
            await invalidComment.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});