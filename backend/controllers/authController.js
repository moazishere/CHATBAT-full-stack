import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import { createToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body
    try {
        const exists = await User.findOne({ email })
        if (exists) {
            return res.json({ message: "Email is already in use" })
        }

        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields must be filled"})
        }

        if (password.length < 6) {
            return res.json({ message: "Password must be at least 6 charachters" })
        }

        const salt = await bcrypt.genSalt(12)
        const hash = await bcrypt.hash(password, salt)

        const user = new User({
            email,
            fullName,
            password: hash
        })

        if(user) {
            createToken(user._id, res)
            await user.save()

            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(400).json({message: "Invalid email"})
        }
        
        const match = await bcrypt.compare(password, user.password)

        if(!match) {
            return res.status(400).json({message: "Invalid password"})
        }

        createToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Eroor in login controller", error.message)
        res.status(500).json({message: "Internal server Error"})
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({messgae: "Internal Server Error"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id

        if(!profilePic) {
            return res.status(401).json({message: "Profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in update profile:", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log('Error in checkAuth controller', error.message);
        res.status(500).json({message: 'Internal Server Error'})
    }
}