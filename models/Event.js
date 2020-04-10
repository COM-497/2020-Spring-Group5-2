const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  descriptionEvent: {
    type: String,
    required: true
  },
  type: {
    type: String,
  },
  descriptionOrg: {
    type: String,
  },
  contact: {
    type: String,
  },
  goal: {
    type: Number,
  },
  whereMoneyGoes: {
    type: String,
    required: true
  }
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;