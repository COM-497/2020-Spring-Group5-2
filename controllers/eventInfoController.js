const Event = require('../models/Event');

exports.getOneEvent = (req, res, next) => {
    Event.find( {'eventName': 'Virual 5k'}, (error, event) => {
      if (error) next(error);
      req.data = event;
      next();
    });
  };