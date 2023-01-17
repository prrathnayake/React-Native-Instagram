import mongoose from "mongoose"
import user from "../models/user.js"
import PostMessage from "../models/postMessage.js"

export const getProfile = async (req, res) => {
    try {
        const {username} = req.body

        const profile = await user.findOne({username})
        if(!profile) { 
            console.log('User doesn\'t exist.')
            return res.status(404).json({message: 'User doesn\'t exist.'})
        }
        return res.json(profile)

    }catch(error){
        res.status(404).json({message: error.message})
        console.log(error)

    }
}

export const updateProfile = async (req, res) => {
    console.log('updating')
    try {
        const {id, name, email, username, mobile, age, profileImg} = req.body
        if(!mongoose.Types.ObjectId.isValid(id)) return console.log('No user with that id')
        const updatedProfile = await user.findByIdAndUpdate(id, { name, email, username, mobile, age, profileImg}, { new: true})
        const uploads = updatedProfile.uploades

        for (let i=0; i<uploads.length; i++){
            if(!mongoose.Types.ObjectId.isValid(uploads[i])) return console.log('No post with that id')
            const updatedpost = await PostMessage.findByIdAndUpdate(uploads[i], {profileImg: updatedProfile.profileImg, username: updatedProfile.username }, { new: true})
        }
        console.log('updated')
        res.json(updatedProfile)

    }catch(error){
        res.status(404).json({message: error.message})
        console.log(error)

    }
}

export const getProfilePost = async (req, res) => {
    try {
        console.log('get req')
        const {id} = req.body

        let postMessages = []

        for (let i=0; i<id.length; i++){
            if(!mongoose.Types.ObjectId.isValid(id[i])) return console.log('No post with that id')
            const post = await PostMessage.findById(id[i])
            postMessages = [...postMessages, post]
        }
        postMessages.sort(function(a, b){return b.createAt-a.createAt});
        console.log('send post')
        res.status(200).json(postMessages)

    }catch(error){
        res.status(404).json({message: error.message})
        console.log(error)

    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await user.find()
        res.status(200).json(users)

    }catch(error){
        res.status(404).json({message: error.message})
        console.log(error)

    }
}

export const followUser = async (req, res) => {
    try {
        const {currentUser, id} = req.body
        
        if(!mongoose.Types.ObjectId.isValid(currentUser)) return console.log('No post with that id')
        if(!mongoose.Types.ObjectId.isValid(id)) return console.log('No post with that id')

        const owner = await user.findById(currentUser)
        const friend = await user.findById(id)


        const filtered = owner.following.some(user=> user.toString() === id.toString())
        if (filtered === false){
            const updated = await user.findByIdAndUpdate(currentUser, {following: [...owner.following, id]})
            const friendupdated = await user.findByIdAndUpdate(id, {followers: [...friend.followers, currentUser]})
            console.log('followed')
        } else{
            const unfollow = owner.following.filter(user=> user.toString() !== id.toString())
            const friendunfollow = friend.followers.filter(user=> user.toString() !== currentUser.toString())

            const updated = await user.findByIdAndUpdate(currentUser, {following: unfollow})
            const friendupdated = await user.findByIdAndUpdate(id, {followers: friendunfollow})
            console.log('unfollowed')
        }

    }catch(error){
        res.status(404).json({message: error.message})
        console.log(error)

    }
}