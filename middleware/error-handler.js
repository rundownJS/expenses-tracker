const { CustomAPIError } = require("../errors")

const errorHandlerMiddleware = (err, req, res, next) =>{

    let customError ={
        statusCode: err.statusCode || 500,
        msg: err.message || "Internal Server Error"
    }

    if(err instanceof CustomAPIError){
        return res.status(err.statusCode).json({ msg: err.message })
    }

    if(err.code && err.code === 11000){
        customError.msg = `User ${Object.values(err.keyValue)} already exists`
        customError.statusCode = 400
    }

    if(err.name === "ValidationError"){
        customError.msg = Object.values(err.errors).map((item) =>{
            return `${item.path} is ${item.kind}`
        }).join(",") 
        customError.statusCode = 400
    }

    if(err.name === "CastError"){
        customError.msg = `Item with id: ${err.value} does not exist`
        customError.statusCode = 404
    }

    return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware