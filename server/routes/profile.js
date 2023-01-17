import express from 'express'
import { getProfile, updateProfile, getProfilePost, getAllUsers, followUser } from '../controllers/profile.js'

const router = express.Router()

router.post('/', getProfile)
router.post('/update', updateProfile)
router.post('/posts', getProfilePost)
router.get('/users', getAllUsers)
router.post('/follow', followUser)

export default router;