const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');


const getTokenFrom = (request) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7);
    }
    return null ;
}
const verifyToken = (request,response,next) =>{
    const  token = getTokenFrom(request);
    if (!token) {
       return response.status(404).json({ message : "token missing "});
    } 
    let decodedToken ;
    try {
         decodedToken = jwt.verify(token,JWT_SECRET);
    } catch (error) {
       return  response.status(400).json(error);
    }   

    next();
}

module.exports = verifyToken ;