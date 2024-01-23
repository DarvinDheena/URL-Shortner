const mongoose = require('mongoose');
const config = require('./src/config');
const app = require('./server');


console.log('connecting to mongoDB');

mongoose.connect(`${ config.URL_NAME }/URL-Shortner`)
    .then(()=>{
        console.log('connected to mongoDB');
        app.listen(`${config.PORT}`,()=>{
            console.log(`server listening on port ${ config.PORT}`);
        })
    })

    

