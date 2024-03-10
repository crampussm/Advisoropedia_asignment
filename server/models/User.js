const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    profilepicture:{
        type: Object,
    }
});

const User = mongoose.model("User", UserSchema);
User.createIndexes();
module.exports = User;