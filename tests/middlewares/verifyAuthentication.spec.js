const jwt = require('jsonwebtoken');
const { verifyAuthenticate } = require('../../src/middlewares/verifyAuthentication');
const { JWT_SECRET } = require('../../src/config/env');

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

afterEach(() => {
    jest.clearAllMocks();
});

describe('verifyAuthenticate middleware', () => {
    const mockRequest = (authorization) => ({
        headers: {
            authorization: authorization,
        },
    });

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    const nextFunction = jest.fn();

    test('should respond with 401 if no token is provided', () => {
        const req = mockRequest();
        const res = mockResponse();

        verifyAuthenticate(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "@authenticate/missing-token",
            message: "Token not sent",
        });
    });

    test('should respond with 401 if token does not have Bearer prefix', () => {
        const req = mockRequest('Token without-bearer-prefix');
        const res = mockResponse();

        verifyAuthenticate(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "@authenticate/invalid-token",
            message: "Token provided is invalid",
        });
    });

    test('should respond with 401 if token is invalid', () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('invalid token'), null);
        });

        const req = mockRequest('Bearer invalid-token');
        const res = mockResponse();

        verifyAuthenticate(req, res, nextFunction);

        expect(jwt.verify).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "@authenticate/invalid-token",
            message: "Token provided is invalid",
        });
    });

    test('should call next if token is valid', () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { id: 'user_id' });
        });

        const req = mockRequest('Bearer valid-token');
        const res = mockResponse();

        verifyAuthenticate(req, res, nextFunction);

        expect(jwt.verify).toHaveBeenCalled();
        expect(req).toHaveProperty('user');
        expect(req.user).toEqual({ id: 'user_id' });
        expect(nextFunction).toHaveBeenCalled();
    });
});