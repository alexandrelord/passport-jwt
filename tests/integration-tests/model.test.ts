import mongoose from 'mongoose';
import User from '../../src/models/user';

// use test database for testing
const mongoDB = 'mongodb://localhost:27017/test';
mongoose.connect(mongoDB);

describe('user model test', () => {
    beforeAll(async () => {
        await User.deleteMany({});
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

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
