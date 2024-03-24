const jwt = require('jsonwebtoken');
const UserModel = require('../../src/model/user.model');
const { compareHash } = require('../../src/utils/hashProvider');
const { login } = require('../../src/controllers/authenticate.controller');

jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn()
    };
});

jest.mock('../../src/model/user.model', () => ({
    findOne: jest.fn().mockReturnThis(),
    lean: jest.fn() 
}));

jest.mock('../../src/utils/hashProvider', () => {
    return {
        compareHash: jest.fn()
    };
});

describe('login', () => {
    beforeEach(() => {
        UserModel.findOne.mockReturnThis(); 
        UserModel.lean.mockResolvedValue(null);
        jwt.sign.mockReset();
        compareHash.mockReset();
    });

    it('should return 400 if user is not found', async () => {
        UserModel.lean.mockResolvedValue(null);

        const request = {
            body: { email: 'nonexistent@example.com', password: 'test' }
        };
        const response = {
            status: jest.fn(() => response),
            json: jest.fn()
        };

        await login(request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            error: "@authenticate/login",
            message: "Invalid email or password"
        });
    });

    it('should return 400 if password is invalid', async () => {
        UserModel.lean.mockResolvedValue({ email: 'user@example.com', password: 'correctHash' });
        compareHash.mockResolvedValue(false);

        const request = {
            body: { email: 'user@example.com', password: 'wrongPassword' }
        };
        const response = {
            status: jest.fn(() => response),
            json: jest.fn()
        };

        await login(request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            error: "@authenticate/login",
            message: "Invalid email or password"
        });
    });

    it('should return a token if email and password are correct', async () => {
        UserModel.lean.mockResolvedValue({ email: 'user@example.com', password: 'correctHash' });
        compareHash.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mockToken');

        const request = {
            body: { email: 'user@example.com', password: 'correctPassword' }
        };
        const response = {
            status: jest.fn(() => response),
            json: jest.fn()
        };

        await login(request, response);

        expect(jwt.sign).toHaveBeenCalled();
        expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'mockToken' }));
    });
});