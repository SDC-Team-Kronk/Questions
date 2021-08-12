const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error('connection error'));

// I believe I'll use this to run functions on the db
db.once('open', () => {

});
