const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Require Event Controller
const eventsController = require('../controllers/eventsController')
// Require Event Model
const Event = require('../models/Event');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// About Us Page
router.get('/about', (req, res) => res.render('about'));

// Events Page
router.get("/events", eventsController.getAllEvents,
 (req, res, next) => {
  console.log(req.data);
  res.render('events', {events: req.data});
});

// My Profile Page
router.get('/myprofile', ensureAuthenticated, (req, res) =>
  res.render('myprofile', {
    user: req.user
  })
);

// Create New Event Form
router.get('/newEvent', ensureAuthenticated, (req, res) => res.render('newEvent'));

router.post('/newEvent', (req, res) => {
  const { eventName, organization, date, descriptionEvent, type, descriptionOrg, contact, goal, whereMoneyGoes } = req.body;
  let errors = [];

  if (!eventName || !organization || !descriptionEvent || !whereMoneyGoes) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if(errors.length > 0){
    res.render('newEvent', {
      errors,
      eventName,
      organization,
      date,
      descriptionEvent,
      type,
      descriptionOrg,
      contact,
      goal,
      whereMoneyGoes
    });
  } else {
    // Validation passed
    Event.findOne({ eventName: eventName })
    .then(event =>{
      if(event) {
        // Event exits
        errors.push({ msg: 'Event with that name already exists'});
        res.render('newEvent', {
          errors,
          eventName,
          organization,
          date,
          descriptionEvent,
          type,
          descriptionOrg,
          contact,
          goal,
          whereMoneyGoes
        });
      } else{
        const newEvent = new Event({
          eventName,
          organization,
          date,
          descriptionEvent,
          type,
          descriptionOrg,
          contact,
          goal,
          whereMoneyGoes
        });
        // Save event
        newEvent.save()
        .then(event => {
          res.redirect('/events');
        })
        .catch(err => console.log(err));
      }
    });
  }
});
  
// Support Page
router.get('/support', (req, res) => res.render('support'));

module.exports = router;