import crypto from 'crypto';
import { validPassword, genPassword, issueJWT } from '../../src/utils/utils';

describe('Utils', () => {
    describe('validPassword', () => {
        it('should return true if the password matches the hash', () => {
            const password = 'password';
            const { salt, hash } = genPassword(password);

            const result = validPassword(password, salt, hash);

            expect(result).toBe(true);
        });
    });
    describe('genPassword', () => {
        it('should return the hashed password', () => {
            const password = 'password';
            const hash = genPassword(password);

            expect(hash).not.toBe(password);
        });
        it('should return a different hash for the same password', () => {
            const password = 'password';
            const hash = genPassword(password);
            const hash2 = genPassword(password);

            expect(hash).not.toBe(hash2);
        });
    });
    describe('issueJWT', () => {
        it('should return an object with the access token and refresh token', () => {
            const _id = '123';
            const tokens = issueJWT(_id);

            expect(tokens).toHaveProperty('accessToken');
            expect(tokens).toHaveProperty('refreshToken');
        });
    });
});
