const CustomAPIError = require("./custom-api")
const Unauthorized = require("./unauth")
const NotFoundError = require("./not-found")
const BadRequestError = require("./bad-req")

module.exports = {
    CustomAPIError,
    Unauthorized,
    NotFoundError,
    BadRequestError
}