import express from 'express'

import { getPosts, createPost, updatePost, deletePost, likePost,  getAllPosts} from '../controllers/posts.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/', getAllPosts)
router.post('/userposts', getPosts)
router.post('/',auth, createPost)
router.patch('/:id', auth, updatePost)
router.delete('/:id/:creator', auth, deletePost)
router.patch('/:id/likePost', auth, likePost)

export default router;