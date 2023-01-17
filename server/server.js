import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import posts from './routes/posts.js'
import user from './routes/user.js'
import profile from './routes/profile.js'

const app = express()
dotenv.config()

app.use(cors({
    origin: '*',
    credentials: true
}));


app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

app.use('/posts', posts)
app.use('/user', user)
app.use('/profile', profile)

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(3001)
}).catch((err) => {
    console.log(err.message)
})