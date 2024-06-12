const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomNo:'string',
    description:'string',
    imageURI:'string',
    
})

module.exports = mongoose.model('roomlocators', roomSchema)