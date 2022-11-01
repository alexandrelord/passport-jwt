import User from '../../src/models/user';
import { setupDB } from '../helpers/helpers';

setupDB();

describe('user model test', () => {
    it('has a module', () => {
        expect(User).toBeDefined();
    });
    describe('find user', () => {
        it('should find a user', async () => {
            const user = new User({ email: 'email', password: { salt: 'salt', hash: 'hash' } });
            await user.save();

            const foundUser = await User.findOne({ email: 'email' });
            const expected = 'email';
            const actual = foundUser?.email;
            expect(actual).toEqual(expected);
        });
    });
    describe('create user', () => {
        it('should create a user', async () => {
            const user = new User({ email: 'email', password: { salt: 'salt', hash: 'hash' } });
            const savedUser = await user.save();

            const expected = 'email';
            const actual = savedUser.email;
            expect(actual).toEqual(expected);
        });
    });
});
