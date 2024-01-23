const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');


const getTokenFrom = (request) => {
    const authorization = request.header('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer')){
        return authorization.subString(7);
    }
    return null ;
}
const verifyToken = (request,response,next) =>{
    const  token = getTokenFrom(request);
    if (!token) {
       return response.status(404).json({ message : "token missing "});
    } 

    let decodedToken = jwt.verify(token,JWT_SECRET);

    request.userId = decodedToken.id ;
    next();
}

module.exports = verifyToken ;