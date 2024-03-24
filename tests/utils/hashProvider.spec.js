const { generateHash, compareHash } = require('../../src/utils/hashProvider');

describe('Hash Provider', () => {
    describe('generateHash', () => {
        it('should generate a hash for the given password', async () => {
            const password = 'mySecretPassword';
            const hashedPassword = await generateHash(password);

            expect(hashedPassword).toBeDefined();
            expect(hashedPassword.length).toBeGreaterThan(0);
        });
    });

    describe('compareHash', () => {
        it('should return true for matching passwords', async () => {
            const password = 'mySecretPassword';
            const hashedPassword = await generateHash(password);
            const result = await compareHash(password, hashedPassword);

            expect(result).toBe(true);
        });

        it('should return false for non-matching passwords', async () => {
            const password1 = 'mySecretPassword';
            const password2 = 'anotherPassword';
            const hashedPassword = await generateHash(password1);
            const result = await compareHash(password2, hashedPassword);
            
            expect(result).toBe(false);
        });
    });
});
