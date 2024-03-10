const mongoose = require('mongoose');
const {Schema} = mongoose;

const PostSchema = new Schema({
    owner:{
        type: String,
        required: true,
    },
    caption:{
        type: String,
    },
    location:{
        type: String,
    },
    postimage: {
        type: String,
    },
    likedBy: {
        type: Array,
    },
    commets: {
        type: Array,
    }
});

const Post = mongoose.model("Post", PostSchema);
Post.createIndexes();
module.exports = Post;