const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    teamA: 'string',
    teamB: 'string',
    game: 'string',
    dateTime: 'string' // Assuming dateTime is stored as a string
});

module.exports  = mongoose.model('teamsschedules', scheduleSchema);

