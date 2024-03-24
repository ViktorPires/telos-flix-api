const { verifyAuthorization } = require('../../src/middlewares/verifyAuthorization');

afterEach(() => {
    jest.clearAllMocks();
});

describe('verifyAuthorization middleware', () => {
    const mockRequest = (role) => ({
        user: {
            role: role,
        },
    });

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    const nextFunction = jest.fn();

    test('should respond with 400 if role is not provided', () => {
        const req = mockRequest();
        const res = mockResponse();

        verifyAuthorization(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "@authorization/missing-role",
            message: "role not sent",
        });
    });

    test('should respond with 401 if role is not admin', () => {
        const req = mockRequest('user');
        const res = mockResponse();

        verifyAuthorization(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "@authorization/invalid-role",
            message: "role provided is not authorized",
        });
    });

    test('should call next if role is admin', () => {
        const req = mockRequest('admin');
        const res = mockResponse();

        verifyAuthorization(req, res, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
    });
});