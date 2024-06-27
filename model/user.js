const mongoose = require("mongoose")
const bcrpyt = require("bcryptjs")
const JWT = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40
    },
    lastName:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        //regex
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 100
    }
}) 

//function keyword instead of arrow so we can use the this property
//encrypting the password and then saving it on the db
UserSchema.pre("save", async function(next){

    const salt = await bcrpyt.genSalt(10)

    this.password = await bcrpyt.hash(this.password, salt)

    next()
})

UserSchema.methods.createJWT = function (){
    return JWT.sign({ userID: this._id, name: this.firstName }, process.env.JWT_SECRET, {expiresIn: "1d"})
}

UserSchema.methods.comparePassword = async function(inputPassword){
    const isMatching = await bcrpyt.compare(inputPassword, this.password)
    return isMatching
}

module.exports = mongoose.model("users", UserSchema)