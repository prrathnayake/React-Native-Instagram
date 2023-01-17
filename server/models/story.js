import mongoose from 'mongoose'

const storySchema = mongoose.Schema({
    creator: String,
    selectedFile: String,
    createAt:{
        type: Date,
        default: new Date()
    }
})

const PostMessage =  mongoose.model('story', storySchema)

export default PostMessage