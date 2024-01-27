const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longURL : {
        type : String,
        require : true
    },
    shortURL : {
        type : String,
        unique : true
    }
},
{
    timestamps : true
});

module.exports = mongoose.model('URL',urlSchema);