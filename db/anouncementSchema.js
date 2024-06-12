const mongoose = require('mongoose');
const moment = require('moment');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Changed to String to store formatted date
    default: () => moment().format('ddd MMM DD/YYYY'), // Format date on creation
  },
});

module.exports = mongoose.model('announcements', announcementSchema);