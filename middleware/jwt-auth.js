const JWT = require("jsonwebtoken")

const auth = async (req, res, next) =>{
    
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer= ")){
        return res.status(401).json({ msg: "Unauthorized access" })
    } 

    const token = authHeader.split(" ")[1]

    try{
        const decoded = JWT.verify(token, process.env.JWT_SECRET)

        req.authorizedUser = { userID:decoded.userID, name:decoded.name }
        next()
    }catch(err){
        return res.status(401).json({ msg: "Invalid token" })
    }
}
module.exports = auth