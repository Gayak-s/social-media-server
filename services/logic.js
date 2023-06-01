const db = require('./db')
const jwt = require('jsonwebtoken')

// register
const register = (username,password)=>{
    return db.User.findOne({
        username
    }).then((result)=>{
        if (result) {
            // exists
            return{
                StatusCode:400,
                message: "Try Another Username"
            }
        }
        else{
            const newUser = new db.User({
                username,
                password,
                profilepic:'https://www.hopectr.org/wp-content/uploads/2022/11/blank-avatar-icon-35.png',
                bio:'',
                post:[]
            })
            //to store new user to mongodb
            newUser.save()
            return {
                StatusCode:200,
                message:"Register Successful"
            }
        }
    })
}

// login
const login = (username,password)=>{
    return db.User.findOne({
        username,
        password
    }).then((result)=>{
        if (result) {
            // user exist
            //generate token with sign() and payload as username
            const token = jwt.sign({
                loginuser:username
            },'supersecretkey12345')
            return{
                StatusCode:200,
                message:'Login Successful',
                token,
                currentUser:result.username
            }
        }
        else{
            return{
                StatusCode:404,
                message:"Invalid Username or Password"
            }
        }
    })
}

// login user details
const loginUser = (username)=>{
    return db.User.findOne({
        username
    }).then((result)=>{
        if (result) {
            return{
                StatusCode:200,
                result
            }
        }
        else{
            return{
                StatusCode:400,
                message:"User doesnt exist"
            }
        }
    })
}

// post image
const postimage = (username,imageurl,caption)=>{
    return db.User.findOne({
        username
    }).then((user)=>{
        if (user) {
            //user exist
            let profilepictuce = user.profilepic
            user.post.push({
                image:imageurl,
                caption:caption
            })
            // saving to mongo db
            user.save()
            const newPost = new db.Post({
                username,
                profilepic:profilepictuce,
                image:imageurl,
                caption
            })
            // save to mongo db
            newPost.save()
            return{
                StatusCode:200,
                messege:'Post added successfully'
            }
        }
        else{
            return{
                StatusCode:400,
                messege:'something went wrong please re login'
            }
        }
    })   
}

// get all posts
const getallposts = ()=>{
    return db.Post.find()
    .then((result)=>{
        if (result) {
            return{
                StatusCode:200,
                result
            } 
        }
        else{
            return{
                messege:"No one posted yet"
            }
        }   
    })
}


// get all users
 const getallusers = ()=>{
    return db.User.find()
    .then((result)=>{
        if (result) {
            return{
                StatusCode:200,
                result
            } 
        }  
    })
}

// edit user
const edituser = (username,image,bio) =>{
    return db.User.findOne({
        username
    })
    .then((user)=>{
        if (user) {
            user.profilepic = image
            user.bio = bio
            user.save()

            return{
                StatusCode:200,
                messege:"Profile Updated"
            }
        }
        else{
            return{
                StatusCode:400,
                messege:"Something went wrong"
            }
        }
    })
}
// update posts collection after user editing profile
const updateposts = (username)=>{
    return db.Post.findOne({
        username
    }).then((result)=>{
        return{result}
    })
}


module.exports = {
    register,
    login,
    postimage,
    loginUser,
    getallposts,
    getallusers,
    edituser,
    updateposts
}