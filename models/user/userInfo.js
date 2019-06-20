import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
    id:Number,
    user_id: Number,
    username: String,
    registe_time: String,
    email: String
});
userInfoSchema.index({id: 1});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

export default UserInfo;