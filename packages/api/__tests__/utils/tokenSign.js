const jwt = require("jsonwebtoken");

const tokenSign = function (user) {

    let token = jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )
    return token

}

const tokenSignRecovery = function (user) {

    let token = jwt.sign(
        {
            id: user.id,
            operation: 'recovery'
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )
    return token
}

module.exports.tokenSign = tokenSign
module.exports.tokenSignRecovery = tokenSignRecovery