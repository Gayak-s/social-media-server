const express = require('express')
const cors = require('cors')
const logic = require('./services/logic')
const jwt = require('jsonwebtoken')

const server = express()

server.use(cors({
    origin:'http://localhost:4200'
}))

server.use(express.json({ limit:'50mb' }))
server.use(
    express.urlencoded({
        limit:"50mb",
        extended:true
    })
)

server.listen(3000,()=>{
    console.log('social media server started at port number 3000');
})



//middle ware for verify token to check user logged in or not
const jwtmiddleware = (req,res,next)=>{
    console.log('inside jwtmiddleware');
    //get token from header
    const token = req.headers['verify-token']
    console.log(token);
    //verify token - verify(token,secretkey) from jsonwebtoken libraby
    try{
        const data = jwt.verify(token,'supersecretkey12345')
        console.log(data);
        //to get login account username (post)
        req.currentuser = data.loginuser
        next()
    }
    catch{
        res.status(401).json({message:"Please login"})
    }
}



// register
server.post('/register',(req,res)=>{
    console.log('inside regiser api');
    console.log(req.body);

     //call register() from logic.js 
     logic.register(req.body.username,req.body.password)
     .then((result)=>{
        //response send to client
        res.status(result.StatusCode).json(result)
     })
})

// login
server.post('/login',(req,res)=>{
    console.log("inside login api");
    console.log(req.body);

     //call login() from logic.js 
     logic.login(req.body.username,req.body.password)
     .then((result)=>{
        //response send to client
        res.status(result.StatusCode).json(result)
     })
})

// login user details
server.get('/getuser',jwtmiddleware,(req,res)=>{
    console.log('inside login get user api');
    logic.loginUser(req.currentuser)
    .then((result)=>{
        res.status(result.StatusCode).json(result)
    })
})

// post image
server.post('/postimg',jwtmiddleware,(req,res)=>{
    console.log('inside post image api');
    console.log(req.body);
    logic.postimage(req.currentuser,req.body.image,req.body.caption)
    .then((result)=>{
        res.status(result.StatusCode).json(result)
    })
})

// get all posts
server.get('/getallposts',jwtmiddleware,(req,res)=>{
    console.log('inside get all posts api');
    logic.getallposts()
    .then((result)=>{
        res.status(result.StatusCode).json(result)
    })
})

// get all users
server.get('/getallusers',(req,res)=>{
    console.log('inside get all users api');
    logic.getallusers()
    .then((result)=>{
        res.status(result.StatusCode).json(result)  
    })
})

// edit profile
server.post('/editprofile',jwtmiddleware,(req,res)=>{
    console.log('inside edit profile api');
    logic.edituser(req.currentuser,req.body.image,req.body.bio)
    .then((result)=>{
        res.status(result.StatusCode).json(result)  
    })
})

server.post('/test',(req,res)=>{
    console.log('inside test');
    logic.updateposts(req.body.username)
    .then((result)=>{
        console.log(result);
    })
})

