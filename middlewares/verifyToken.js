const jwt = require('jsonwebtoken')

module.exports = function authenticateToken(req, res, next) {
    const token = req.headers['authorization']
    if (token === undefined || token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}