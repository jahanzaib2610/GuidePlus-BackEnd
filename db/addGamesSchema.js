const mongoose = require('mongoose')

const addGames = new mongoose.Schema({
    game:'string',
    limit:'string'
})

module.exports = mongoose.model('games', addGames)