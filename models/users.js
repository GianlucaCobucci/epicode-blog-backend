import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        max: 30
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true,
    },
    img : {
        type: String,
        required: false,
        default: "https://picsum.photos/1920/1080"
    }
})

const userModel = mongoose.model('userModel', UserSchema, 'users')

export default userModel
