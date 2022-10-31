import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    email: string;
    password: {
        salt: string;
        hash: string;
    };
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: {
        salt: { type: String, required: true },
        hash: { type: String, required: true },
    },
});

export default mongoose.model<IUser>('User', UserSchema);
