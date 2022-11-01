import mongoose from 'mongoose';
import User from '../../src/models/user';

export const setupDB = () => {
    const mongoDB = 'mongodb://localhost:27017/test';
    mongoose.connect(mongoDB);

    beforeAll(async () => {
        await User.deleteMany({});
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
};
