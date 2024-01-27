
const userRouter = require('express').Router();
const User = require('../models/user');
const config = require('../config');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


// endpoint to create a user 

userRouter.post('/register', async (request,response) => {
    try {
        const { firstName , lastName , userName , password } = request.body ;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);
        const newUser = new User ({
            firstName ,
            lastName ,
            userName ,
            password : passwordHash
        })
         await newUser.save()
         .then (async ()=>{
            try {
                // get a user to activate
                const user = await User.findOne({userName});

                // create a random string for verification
                const randomString = Math.random().toString(36).substring(2,36);
                // now create a nodeailer transporter
                const transporter = nodemailer.createTransport({
                    service : "gmail",
                    auth : {
                        user : config.EMAIL_ADDRESS,
                        pass : config.EMAIL_PASSWORD 
                    }
                })
                // lets send the mail to user 
                const sendMail = async () => {
                    const info = await transporter.sendMail({
                        from : `"Darvin Ganeshan" <${config.EMAIL_ADDRESS}>`,
                        to : userName,
                        subject : "Account Verification ",
                        text : `To verify your account please click the link  "https://localhost:6001/users/verification/${ randomString }"` 
                    })
                }
                sendMail()
                    .then( async ()=>{
                        user.resetRandomString = randomString ;
                        await user.save();
                        response.status(200).json({ message : 'New user Created successfully & The Verification Link send to your registerd Email id' })
                    })
            } catch (error) {
                console.log(error);
            }
            
         })
         .catch((error)=>{
            response.status(400).json(error);
         })

    } catch (error) {
        response.status(400).json(error);
    }
})

// endpoint to activate the account 

userRouter.get('/verification/:randomstring',async (request,response)=>{
    const resetRandomString = request.params.randomstring ;
    const user = await User.findOne({resetRandomString});
    user.status = true ;
    await user.save();
    response.status(200).json({ message : "Account activated successfully & logon to URL Shortner App"})
})

// endpoint to login

userRouter.post('/login', async (request,response) => {
   try {
    const { userName , password } = request.body ;
    const user = await User.findOne({userName})
    if (!user) {
        return response.status(404).json({ message : "Entered Username does not exist or incorrect" });
    }
    if (user.status === false ){
        return response.status(400).json({ message: "The User Account must need verification before use" });
    }
     const isAuth = await bcrypt.compare(password,user.password);
    if (!isAuth){
        return response.status(400).json({ message : "password did not match or incorrect" });
    }
    const token = jwt.sign({userName : user.userName , id : user._id},config.JWT_SECRET);
        return response.status(200).json({ token , userName : user.userName });
   } catch (error) {
    console.log(error);
   }
})

// endpoint to forgotpassword and reset it

userRouter.get('/forgot/:userName', async (request,response) => {
    const userName = request.params.userName ;
    const user =  await User.findOne({userName })
    if (!user){
        return response.status(404).json({ message : "Entered Username does not exist or incorrect" });
    } 
    // create a random string for verification
    const randomString = Math.random().toString(36).substring(2,36);
    // now create a nodeailer transporter
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : config.EMAIL_ADDRESS,
            pass : config.EMAIL_PASSWORD 
        }
    })
    // lets send the mail to user 
    const sendMail = async () => {
        const info = await transporter.sendMail({
            from : `"Darvin Ganeshan" <${config.EMAIL_ADDRESS}>`,
            to : userName,
            subject : "Account Verification ",
            text : `To reset your password use this code   "/${ randomString }"` 
        })
    }
    sendMail()
        .then( async ()=>{
            user.resetRandomString = randomString ;
            await user.save();
            response.status(200).json({  message : "The forgot password link send to your registered email id"})
        })
})


// lets verify the reset password string 

userRouter.get('/forgot/verify/:randomString' , async (request,response) => {
    const resetRandomString = request.params.randomString;
    const user = await  User.findOne({resetRandomString});
    if (!user){
        return response.status(400).json({ message : "String does not match" });
    }
    response.status(200).json({ message : "string verified successfully" });
    
})
// Endpoint to  reset the password
userRouter.patch('/forgot/verify/:userName',async (request,response)=>{
    const password = request.body.password;
    const userName = request.params.userName;

    // find user details and update the password
    const user = await User.findOne({userName})
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password,salt);
    await user.save()
         .then(()=>{
            response.status(200).json({ message:"password changed successfully" });
         })
})


module.exports = userRouter ;