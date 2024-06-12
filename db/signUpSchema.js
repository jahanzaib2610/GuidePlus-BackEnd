const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:'string',
    rollNo:'string',
    email:{
        type: 'string',
        unique: true
    },
    gender:'string',
    department:'string',
    password:'string',
})

module.exports = mongoose.model('users', userSchema)