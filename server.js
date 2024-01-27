const express = require('express');
const cors = require('cors');
const userRouter = require('./src/controllers/user');
const urlRouter = require('./src/controllers/url');

const app = express();

// adding middlewares
app.use(express.json());
app.use(cors());

// adding routes
app.get('/',(request,response) =>{
    response.status(200).json({ message : "okay" });
})
app.use('/users',userRouter);
app.use('/url',urlRouter);


module.exports = app ;