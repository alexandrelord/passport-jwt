import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    email: String,
    hash: String,
    salt: String,
});

export default mongoose.model('User', UserSchema);
