const mongoose = require('mongoose');

const { MONGO_TEST_DB_URI } = require('../../src/config/env');
const Movie = require('../../src/model/movie.model');

describe('Movie Model', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_TEST_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new movie', async () => {
        const validMovie = new Movie({
            title: 'The Shawshank Redemption',
            description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            year: 1994,
            genres: ['Drama'],
            image: 'shawshank_redemption.jpg',
            video: 'shawshank_redemption.mp4',
        });
        const savedMovie = await validMovie.save();

        expect(savedMovie._id).toBeDefined();
        expect(savedMovie.title).toBe('The Shawshank Redemption');
        expect(savedMovie.description).toBe('Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.');
        expect(savedMovie.year).toBe(1994);
        expect(savedMovie.genres).toStrictEqual(['Drama']);
        expect(savedMovie.image).toBe('shawshank_redemption.jpg');
        expect(savedMovie.video).toBe('shawshank_redemption.mp4');
    });

    it('should not save movie without required fields', async () => {
        const invalidMovie = new Movie({});

        let err;
        try {
            await invalidMovie.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});