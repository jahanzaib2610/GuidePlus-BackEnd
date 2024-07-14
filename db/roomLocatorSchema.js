const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomNo:'string',
    description:'string',
    imageURL:'string',
    
})

module.exports = mongoose.model('roomlocators', roomSchema)