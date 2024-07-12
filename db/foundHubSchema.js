const mongoose = require('mongoose')

const foundHubSchema = new mongoose.Schema({
    imageURI:'string',
    status:'string',
    description:'string',
    contact:'string',
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
    
})
foundHubSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('foundhubs', foundHubSchema)