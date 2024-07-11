const User = require("../model/user")
const bcrpyt = require("bcryptjs")
const JWT = require("jsonwebtoken")
const { BadRequestError, Unauthorized } = require("../errors")
require("dotenv")

const registerUser = async (req, res) =>{

    const { firstName, lastName, password, email } = req.body

    if(firstName && lastName && password && email){

        //verify the recaptcha 
        const recaptchaSECRET_KEY = process.env.SECRET_KEY
        const recaptchaResponse = req.body["g-recaptcha-response"]

        if(!recaptchaResponse){
            return res.status(400).json({msg: "reCAPTCHA not verified"})
        }

        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSECRET_KEY}&response=${recaptchaResponse}`
        
        const request = await fetch(verificationURL, {
            method: "POST"
        })
        const data = await request.json()

        if(data.success){

            const registerNewUser = await User.create({ firstName: firstName, lastName: lastName, email: email, password:password })
            const token = registerNewUser.createJWT()

            return res.status(201).json({ user: {name:registerNewUser.firstName}, token})
            
        }else{
            return res.status(400).json({msg: "reCAPTCHA not verified"})
        }
        
    }else{
        return res.status(400).json({msg: "Unable to create user"})
    }

}


const loginUser = async (req, res) =>{
    
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({msg: "Please provide email and password"})
    }

    const recaptchaSECRET_KEY = process.env.SECRET_KEY
    const recaptchaResponse = req.body["g-recaptcha-response"]

    if(!recaptchaResponse){
        return res.status(400).json({msg: "reCAPTCHA not verified"})
    }

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSECRET_KEY}&response=${recaptchaResponse}`
    
    const request = await fetch(verificationURL, {
        method: "POST"
    })
    const data = await request.json()
    
    

    if(data.success){
    
        //find with the email
        const user = await User.findOne({ email })
        //if no found then 401
        if(!user){
            return res.status(401).json({msg: "Invalid email or password."})
        }

        //now try to match the passwords
        const correctPassword = await user.comparePassword(password)

        //if the function returns false => 401
        if(!correctPassword){
            return res.status(401).json({msg: "Invalid email or password."})
        }

        //create jwt
        const token = user.createJWT()
        return res.status(200).json({ user: {name:user.firstName}, token })
        
    }else{
        return res.status(400).json({msg: "reCAPTCHA not verified"})
    }

} 


const verifyJWT = async (req, res) =>{

    const { token } = req.headers

    if(!token){
        return res.status(401).json({ msg: "Unauthorized access" })
    }

    try{
        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        return res.status(200).json({ msg: "Valid token", data: decoded, success:true })
    }catch(err){
        return res.status(401).json({ msg: "Invalid token" })
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyJWT
}