const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://champ18ion:1V1q1XMHGIyNLfNL@cluster0.jxaps7z.mongodb.net/Wormhole');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;