const mongoose = require('mongoose');

const { MONGO_TEST_DB_URI } = require('../../src/config/env');
const User = require('../../src/model/user.model');
const { compareHash } = require('../../src/utils/hashProvider');

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_TEST_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new user', async () => {
        const validUser = new User({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            cellphone: '1234567890',
            role: 'customer',
        });
        const savedUser = await validUser.save();
        const isPasswordMatch = await compareHash('password123', savedUser.password);

        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe('John Doe');
        expect(savedUser.email).toBe('johndoe@example.com');
        expect(isPasswordMatch).toBe(true);
        expect(savedUser.cellphone).toBe('1234567890');
        expect(savedUser.role).toBe('customer');
    });

    it('should not save user without required fields', async () => {
        const invalidUser = new User({});

        let err;
        try {
            await invalidUser.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should hash password on pre save hook', async () => {
        const userWithPassword = new User({
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            password: 'password456',
            cellphone: '1234567890',
            role: 'customer',
        });

        await userWithPassword.save();

        expect(userWithPassword.password).not.toBe('password456');
    });

    it('should hash password on pre findOneAndUpdate hook', async () => {
        const userWithoutHashedPassword = new User({
            name: 'Alice Smith',
            email: 'alicesmith@example.com',
            password: 'password789',
            cellphone: '1234567890',
            role: 'customer',
        });

        await userWithoutHashedPassword.save();

        await User.findOneAndUpdate({ email: 'alicesmith@example.com' }, { password: 'newpassword789' });

        const updatedUser = await User.findOne({ email: 'alicesmith@example.com' });

        expect(updatedUser.password).not.toBe('newpassword789');
    });
});