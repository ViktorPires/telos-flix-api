const jwtService = require('jsonwebtoken');
const { verifyIfUserHasAuthentication } = require('../../src/middlewares/verifyIfUserHasAuthentication');

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

describe('verifyIfUserHasAuthentication middleware', () => {
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
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    afterEach(() => {
        consoleLogSpy.mockClear();
        nextFunction.mockClear();
    });

    afterAll(() => {
        consoleLogSpy.mockRestore();
    });

    test('should set user to null and call next if no authorization header', () => {
        const req = mockRequest();
        const res = mockResponse();

        verifyIfUserHasAuthentication(req, res, nextFunction);

        expect(req.user).toBeNull();
        expect(nextFunction).toHaveBeenCalled();
    });

    test('should set user to null and call next if authorization header has no Bearer prefix', () => {
        const req = mockRequest('Token invalid-format');
        const res = mockResponse();

        verifyIfUserHasAuthentication(req, res, nextFunction);

        expect(req.user).toBeNull();
        expect(nextFunction).toHaveBeenCalled();
    });

    test('should set user to null, log error, and call next if token is invalid', () => {
        jwtService.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('invalid token'), null);
        });

        const req = mockRequest('Bearer invalid-token');
        const res = mockResponse();

        verifyIfUserHasAuthentication(req, res, nextFunction);

        expect(jwtService.verify).toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith("error: @authenticate/invalid-token");
        expect(consoleLogSpy).toHaveBeenCalledWith("Token provided is invalid");
        expect(req.user).toBeNull();
        expect(nextFunction).toHaveBeenCalled();
    });

    test('should set user to decoded token and call next if token is valid', () => {
        const decodedToken = { id: 'user_id' };
        jwtService.verify.mockImplementation((token, secret, callback) => {
            callback(null, decodedToken);
        });

        const req = mockRequest('Bearer valid-token');
        const res = mockResponse();

        verifyIfUserHasAuthentication(req, res, nextFunction);

        expect(jwtService.verify).toHaveBeenCalled();
        expect(req.user).toEqual(decodedToken);
        expect(nextFunction).toHaveBeenCalled();
    });
});