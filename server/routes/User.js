//User.js


import express from 'express'
import { signupUser, loginUser } from '../controllers/userController.js'

const router = express.Router()

//login route
router.post('/login',loginUser)


//signup/register route
router.post('/signup',signupUser)


export default router;