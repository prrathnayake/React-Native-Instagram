import express from 'express'
import { login, signin, getUser } from '../controllers/user.js'

const router = express.Router()

router.post('/login', login)
router.post('/signin', signin)

router.post('/', getUser)

export default router;