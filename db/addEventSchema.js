const mongoose = require('mongoose')

const addEventSchema = new mongoose.Schema({
    eventName:'string',
    eventDate:'string',
    eventTime:'string',
    eventLocation:'string',
    
})

module.exports = mongoose.model('addEvents', addEventSchema)