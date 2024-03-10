const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
const {validationResult, body, oneOf} = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require('./models/User');
const Post = require('./models/Post');
const getUser = require('./middleware/getUser');

const JWT_SECRET = "secrettosign";

const mongoURI = "mongodb://localhost:27017/advioo";

mongoose.connect(mongoURI).then(console.log("Database Conected"));

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8080;

app.post("/signup", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Length of password should be more than 8').isLength({min: 8}),
], async(req, res)=>{
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ error: errors.array(), success});
    }

    try {
        const {email, firstname, lastname, password} = req.body;

        let creatorbyemail = await User.findOne({email: email});
        if(creatorbyemail){return res.status(400).send({error: [{msg: "Email already exists"}], success});}

        console.log(email, firstname, lastname, password);
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: securePassword,
        })
        success = true;
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.send({authToken ,success});
    } catch (error) {
        console.error(error);
        res.status(500).json({success, error: [{msg: "some error occured"}]});
    }
})

app.post('/login', [
    oneOf([
        body('usernameOrEmail', 'Enter a valid username').isLength({min: 2}).matches(/^[a-z0-9.,'!&]+$/),
        body('usernameOrEmail', 'Enter a valid email').isEmail(),
    ]),
    body('password', 'Length of password should be more than 8').isLength({min: 8})
], async(req, res)=>{
    let success = false;

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({error: errors.array(), success});
    }

    try {
        const {usernameOrEmail, password} = req.body;
        console.log(usernameOrEmail, password);
        let user = await User.findOne({email: usernameOrEmail});
        if (!user) {
            user = await User.findOne({username: usernameOrEmail});
        }

        if (!user) {
            return res.status(400).send({error: [{msg: "Wrong email or username"}], success});
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).send({error: [{msg: "Wrong password"}], success});
        }

        success = true;
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken, success})
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error: [{msg: "some error occured"}]});
    }
})

app.put('/adddetails', getUser, [
    body('username', 'Enter a valid username').isLength({min: 2}).matches(/^[a-z0_9.,'!&]+$/),
], async(req, res)=>{
    let success = false;

    let errors = validationResult(req);
    if(!errors.isEmpty()){ return res.send({error: errors.array(), success}) }

    var user = await User.findOne({_id: req.id});
    if(!user){return res.send({"error": "Inapropiate Request", success});}

    try {
        const updatedUser = {};
        const {username, profilepicture} = req.body;

        var existingUser = await User.findOne({username: username});
        if(existingUser){ res.send({error: [{msg: "Username not available"}], success}) }

        updatedUser.username = username;
        if(profilepicture){ updatedUser.profilepicture = profilepicture };

        user = await User.findByIdAndUpdate(req.id, {$set: updatedUser}, {new: true});
        success = true;
        res.json({success, user});
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error: [{msg: "some error occured"}]});
    }

})

app.get('/checkcompletion', getUser ,async(req, res)=>{
    let success = false;
    var user = await User.findById(req.id);
    if(!user){ return res.send({"error": "Inapropiate Request", success}); }
    var username = await user.username;

    if(!username){
        return res.send({"error": "Set username first", success});
    }

    success = true;
    res.json({success});
})

app.post('/createpost', getUser, async(req, res)=>{
    let success = false;
    var user = await User.findById(req.id);
    if(!user){ return res.send({"error": "Inapropiate Request", success}); }

    try {
        const {caption, location, postimage} = req.body;
        console.log(caption, location, postimage);

        const post = await Post.create({
            owner: user._id,
            caption: caption,
            location: location,
            postimage: postimage,
        })

        success = true;
        res.send({success, post});

    } catch (error) {
        console.log(error);
        res.status(500).json({success, error: [{msg: "some error occured"}]});
    }
})

app.get('/getallposts', getUser, async(req, res)=>{
    let success = false
    try {
        const allPosts = await Post.find({});
        if(!allPosts){ return res.send({"error": "Inapropiate Request", success}); }

        success = true;

        res.json({success, allPosts});
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error: [{msg: "some error occured"}]});
    }
})

app.get('/getuserdetails', getUser, async(req, res)=>{
    let success = false;
    try {
        const {userid} = req.headers;
        const user = await User.findOne({_id: userid});
        if(!user){
            return res.send({"error": "Inapropiate Request", success});
        }

        var username = await user.username;
        var profilepicture = await  user.profilepicture;
        success = true;
        res.json({success, username, profilepicture })
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error: [{msg: "some error occured"}]});
    }
})

app.put('/likedislike', getUser, async(req, res)=>{
    let success = false;

    try {
        let updatedPost = {};
        const { postId } = req.body;

        let post = await Post.findById(postId);
        if(!post){ return res.send({"error": "Inapropiate Request", success}); }

        updatedPost.likedBy = post.likedBy;

        if(updatedPost.likedBy.includes(req.id.toString())){
            let index = updatedPost.likedBy.indexOf(req.id.toString());
            updatedPost.likedBy.splice(index, 1);
        }else{
            updatedPost.likedBy.push(req.id);
        }

        post = await Post.findByIdAndUpdate(postId, {$set: updatedPost}, {new: true});
        success = true;
        res.json({success, post});
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error: [{msg: "some error occured"}]});
    }
})

app.post('/checkifliked', getUser, async(req, res)=>{
    let success = false;
    try {
        const userId = req.id;
        const {postId}= req.body;
        let post = await Post.findOne({_id: postId});
        if(!post){ 
            return res.send({"error": "Inapropiate Request", success}); 
        }

        let likedBy = post.likedBy;

        if(likedBy.includes(userId.toString())){
            success = true;
        }

        res.json({success});
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error: [{msg: "some error occured"}]});
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is listening at port: ${PORT}`);
})