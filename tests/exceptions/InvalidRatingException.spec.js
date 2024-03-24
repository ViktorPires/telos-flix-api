const { InvalidRatingException } = require('../../src/exceptions/InvalidRatingException');

describe('InvalidRatingException', () => {
    test('should have the correct default message', () => {
        const exception = new InvalidRatingException();
        expect(exception.message).toBe("Invalid rating value. Must be an integer between 1 and 5");
        expect(exception.name).toBe("InvalidRatingException");
        expect(exception.statusCode).toBe(400);
    });

    test('should allow a custom message', () => {
        const customMessage = "Custom error message";
        const exception = new InvalidRatingException(customMessage);
        expect(exception.message).toBe(customMessage);
        expect(exception.name).toBe("InvalidRatingException");
        expect(exception.statusCode).toBe(400);
    });
});