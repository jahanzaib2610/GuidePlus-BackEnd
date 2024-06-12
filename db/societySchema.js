const mongoose = require('mongoose')

const clubsAndSociety = new mongoose.Schema({
    clubName:'string',
    clubDescription:'string',
    clubPresident:'string',
    contact:'string'
    
})

module.exports = mongoose.model('clubsandsocieties', clubsAndSociety)