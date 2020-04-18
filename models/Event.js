const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
  },
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
    default: Date
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