const path = require("path")

const notFound = (req, res) =>{
    res.sendFile(path.join(__dirname, "..", "public", "404-browser", "not-found.html"))
}
module.exports = notFound