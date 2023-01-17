import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import user from "../models/user.js"

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const existingUser = await user.findOne({email})
        if(!existingUser) {
            console.log('User doesn\'t exist.')
            return res.status(200).json({message: 'User doesn\'t exist.'})}
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) {
            console.log('Invalid credentials.')
            return res.status(200).json({message: 'Invalid credentials'})}
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test')
        console.log('sending data')
        res.status(200).json({ result: existingUser, token: token})

    }catch(error){
        res.status(500).json({message: 'Somthing went wrong...'})
    }
}

export const signin = async (req, res) => {
    const {email, name, username, password, confirmPassword} = req.body
    try {
        const existingUser = await user.findOne({email})
        if(existingUser) return res.status(200).json({message: 'User already exist.'})

        if(password !== confirmPassword) return res.status(200).json({message: 'Password don\'t match'})
        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await user.create({email, password:hashedPassword, name, username})
        const token = jwt.sign({ email: result.email, id: result._id}, 'test')

        res.status(200).json({ result, token})

    }catch(error){
        res.status(404).json({message: error.message})
        console.log(error)
    }
}

export const getUser = async (req, res) => {
    const id = req.body.id
    try {
        const userDetails = await user.findOne({_id: id})

        res.status(200).json(userDetails)
    }catch(error){
        console.log(error)
        res.status(404).json({message: error.message})
    }
}