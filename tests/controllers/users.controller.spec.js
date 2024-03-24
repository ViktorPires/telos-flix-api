const UserModel = require("../../src/model/user.model");
const { list, getById, create, createAdminUsers, update, remove } = require("../../src/controllers/users.controller");

jest.mock("../../src/model/user.model", () => ({
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
}));

describe('Users Controller', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;

    beforeEach(() => {
        mockRequest = {
            params: {},
            body: {}
        };
        mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('list', () => {
        it('should return a list of users without passwords', async () => {
            const expectedUsers = [
                { _id: '1', username: 'user1', email: 'user1@example.com' },
                { _id: '2', username: 'user2', email: 'user2@example.com' }
            ];
            UserModel.find.mockResolvedValue(expectedUsers);

            await list(mockRequest, mockResponse);

            expect(UserModel.find).toHaveBeenCalledWith({}, { password: 0 });
            expect(mockResponse.json).toHaveBeenCalledWith(expectedUsers);
        });

        it('should handle errors when failing to list users', async () => {
            const errorMessage = { error: "users/list", message: "Failed to list users" };
            UserModel.find.mockRejectedValue(new Error("Database error"));

            await list(mockRequest, mockResponse);

            expect(UserModel.find).toHaveBeenCalledWith({}, { password: 0 });
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(errorMessage);
        });
    });

    describe('getById', () => {
        it('should return a user without a password by ID', async () => {
            const expectedUser = { _id: '1', username: 'user1', email: 'user1@example.com' };
            mockRequest.params.id = '1';
            UserModel.findById.mockResolvedValue(expectedUser);

            await getById(mockRequest, mockResponse);

            expect(UserModel.findById).toHaveBeenCalledWith('1', { password: 0 });
            expect(mockResponse.json).toHaveBeenCalledWith(expectedUser);
        });

        it('should return a 400 error if user is not found', async () => {
            const userId = 'nonexistent';
            mockRequest.params.id = userId;
            UserModel.findById.mockResolvedValue(null);

            await getById(mockRequest, mockResponse);

            expect(UserModel.findById).toHaveBeenCalledWith(userId, { password: 0 });
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "@users/getById",
                message: `User not found ${userId}`
            });
        });

        it('should return a 400 error if findById throws an error', async () => {
            const userId = '1';
            const errorMessage = 'Database error';
            mockRequest.params.id = userId;
            UserModel.findById.mockRejectedValue(new Error(errorMessage));

            await getById(mockRequest, mockResponse);

            expect(UserModel.findById).toHaveBeenCalledWith(userId, { password: 0 });
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "@users/getById",
                message: errorMessage
            });
        });
    });

    describe('create', () => {
        it('should create a new customer user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'securepassword',
                cellphone: '1234567890'
            };
            const expectedUser = { ...userData, role: 'customer', _id: '1' };
            mockRequest.body = userData;
            UserModel.create.mockResolvedValue(expectedUser);

            await create(mockRequest, mockResponse);

            expect(UserModel.create).toHaveBeenCalledWith({ ...userData, role: 'customer' });
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedUser);
        });

        it('should return a 400 status when user creation fails', async () => {
            const errorMessage = 'Error creating user';
            mockRequest.body = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'securepassword',
                cellphone: '0987654321'
            };
            UserModel.create.mockRejectedValue(new Error(errorMessage));

            await create(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "@users/create",
                message: errorMessage
            });
        });
    });

    describe('createAdminUsers', () => {
        it('should create a new admin user successfully', async () => {
            const adminData = {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'adminpassword',
                cellphone: '1234567890'
            };
            const expectedAdmin = { ...adminData, role: 'admin', _id: '2' };
            mockRequest.body = adminData;
            UserModel.create.mockResolvedValue(expectedAdmin);

            await createAdminUsers(mockRequest, mockResponse);

            expect(UserModel.create).toHaveBeenCalledWith({ ...adminData, role: 'admin' });
            expect(mockResponse.json).toHaveBeenCalledWith(expectedAdmin);
        });

        it('should return a 400 status when admin user creation fails', async () => {
            const errorMessage = 'Error creating admin user';
            mockRequest.body = {
                name: 'Super Admin',
                email: 'superadmin@example.com',
                password: 'superpassword',
                cellphone: '0987654321'
            };
            UserModel.create.mockRejectedValue(new Error(errorMessage));

            await createAdminUsers(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "@users/create",
                message: errorMessage
            });
        });
    });
    describe('update', () => {
        it('should update the user successfully', async () => {
            const userId = '1';
            const updateData = { name: 'Updated User', email: 'updated@example.com', cellphone: '1234567890', password: 'newpassword' };
            const updatedUser = { ...updateData, _id: userId };
            mockRequest.params.id = userId;
            mockRequest.user = { _id: userId, role: 'customer' };
            mockRequest.body = updateData;
            UserModel.findById.mockResolvedValue({ _id: userId });
            UserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

            await update(mockRequest, mockResponse);

            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true });
            expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should return a 401 error if user tries to update another user without admin role', async () => {
            const userIdToUpdate = '2';
            const userId = '1';
            mockRequest.params.id = userIdToUpdate;
            mockRequest.user = { _id: userId, role: 'customer' };
            mockRequest.body = { name: 'Attempt Update' };
            UserModel.findById.mockResolvedValue({ _id: userIdToUpdate });

            await update(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "@users/update",
                message: 'You do not have permission to update this user',
            });
        });

        it('should return a 400 error if user not found', async () => {
            const userId = 'nonexistent';
            mockRequest.params.id = userId;
            mockRequest.user = { _id: userId, role: 'admin' };
            UserModel.findById.mockResolvedValue(null);

            await update(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "@users/update",
                message: `User not found ${userId}`,
            });
        });
    });

    describe('remove', () => {
        it('should delete the user successfully', async () => {
            const userId = '1';
            mockRequest.params.id = userId;
            mockRequest.user = { _id: userId, role: 'customer' };
            UserModel.findById.mockResolvedValue({ _id: userId });

            await remove(mockRequest, mockResponse);

            expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
        });

        it('should return a 401 error if user tries to delete another user without admin role', async () => {
            const userIdToDelete = '2';
            const userId = '1';
            mockRequest.params.id = userIdToDelete;
            mockRequest.user = { _id: userId, role: 'customer' };
            UserModel.findById.mockResolvedValue({ _id: userIdToDelete });

            await remove(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "@users/remove",
                message: 'You do not have permission to delete this user',
            });
        });

        it('should return a 400 error if user not found during delete', async () => {
            const userId = 'nonexistent';
            mockRequest.params.id = userId;
            mockRequest.user = { _id: userId, role: 'admin' };
            UserModel.findById.mockResolvedValue(null);

            await remove(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: "@users/remove",
                message: `User not found ${userId}`,
            });
        });
    });
});