const mongoose = require('mongoose')

const teamRegister = new mongoose.Schema({
    teamName: {
        type: 'string',
        unique: true
    },
    captName: 'string',
    game: 'string',
    department: 'string',
    limit: 'string'

})

module.exports = mongoose.model('registeredteams', teamRegister)