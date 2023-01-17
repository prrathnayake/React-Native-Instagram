import mongoose from 'mongoose'

export const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    username: String,
    profileImg: {
        type: String,
        default: null
    },
    likes: {
        type: [String],
        default: []
    },
    createAt:{
        type: Date,
        default: new Date()
    }
})

const PostMessage =  mongoose.model('postMessage', postSchema)

export default PostMessage
