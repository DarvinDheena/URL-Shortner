const urlRouter = require('express').Router();
const verifyToken = require('../middleware/auth');
const URL = require('../models/url')
const User = require('../models/user');

urlRouter.get('/all',async (request,response) => {
    await URL.find({})
        .then((data)=>{
            response.status(200).json(data);
        })
        .catch((error) => {
            response.status(400).json(error);
        })
})

urlRouter.post('/create', verifyToken , (request,response) => {
    const longURL = request.body.longURL ;
    const randomURL = Math.random().toString(36).substring(2,36);
    const newURL = new URL ({
        longURL,
        shortURL : randomURL
    })

    newURL.save()
        .then(()=>{
            response.status(200).json({ newURL });
        })
        .catch((error) => {
            response.status(400).json({error});
        })
})

urlRouter.get('/:shortURl',async (request,response)=>{
    const shortURL = request.params.shortURl
    await URL.findOne({ shortURL })
        .then((data)=>{
            response.redirect(data.longURL);
        })
        .catch ((error) => {
            response.status(400).json(error);
        })
})


module.exports = urlRouter ;