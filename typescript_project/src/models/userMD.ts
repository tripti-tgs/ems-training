import mongoose, { Document, Model } from 'mongoose';

interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User: Model<UserDoc> = mongoose.model<UserDoc>('User', userSchema);

export default User;
