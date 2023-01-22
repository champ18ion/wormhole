const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true,
        max:50
    },
    likedMovies: {
        type: Array,
        
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;