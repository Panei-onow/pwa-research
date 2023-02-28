const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader){
        res.status(401).json({
            status: 'fail',
            message: 'Not Authorized'
        })
    }
    const token = authHeader.split(' ')[1];
    let decodeToken;
    try{
        decodeToken = jwt.verify(token, 'secret');
        console.log(decodeToken);
    }
    catch (err) {
        res.status(500).json({
            status: 'fail'
        })
    }
    if(!decodeToken) {
        res.status(401).json({
            status: 'fail',
            message: 'Not Authorized'
        })
    }
    req.userId = decodeToken.userId;
    next();
};