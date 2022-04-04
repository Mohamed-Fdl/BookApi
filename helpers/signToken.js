const jwt = require('jsonwebtoken')
module.exports = function generateAccessToken(email) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: email
    }, process.env.TOKEN_SECRET);
}