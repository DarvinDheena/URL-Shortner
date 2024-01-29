const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        require : true 
    },
    lastName : {
        type : String,
        require : true
    },
    userName : {
        type : String,
        require : true ,
        unique : true
    },
    password : {
        type : String,
        require : true 
    },
    status : {
        type : Boolean ,
        default : false
    },
    resetRandomString : {
        type : String,
        default : ''
    },
    createdURL : {
        type : Array ,
        default : []
    }
},{
    timestamps : true
})


module.exports = mongoose.model('User',userSchema);