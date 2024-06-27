const antiXSS = async (req, res, next) =>{
    res.setHeader("Content-Security-Policy", "script-src 'self' https://www.google.com https://www.gstatic.com; object-src 'none';")
    next()
}

module.exports = antiXSS