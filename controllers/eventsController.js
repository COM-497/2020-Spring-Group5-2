const Event = require('../models/Event');

exports.getAllEvents = (req, res, next) => {
    Event.find( {}, (error, events) => {
      if (error) next(error);
      req.data = events;
      next();
    });
  };