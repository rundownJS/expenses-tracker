const notFound = (req, res) =>{
    //handle with files later
    res.status(404).send("Route does not exist")
}
module.exports = notFound