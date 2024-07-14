require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri ='mongodb://127.0.0.1:27017/GuidePlus'

// console.log(process.env.MONGODB_URI);
if(mongoose.connect(mongoUri)){
    console.log('Connection Successful');
}
