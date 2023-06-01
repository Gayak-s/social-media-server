const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Socialmedia')

const User = mongoose.model('User',{
    username:String,
    password:String,
    profilepic:String,
    bio:String,
    post:[]
})

const Post = mongoose.model('Post',{
    username:String,
    profilepic:String,
    image:String,
    caption:String
})

module.exports = {
    User,
    Post
}