const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Require Event Controller
const eventsController = require('../controllers/eventsController')
const eventInfoController = require('../controllers/eventInfoController')

// Configure Paypal
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AWzo6x-rqG01GF9D6AcEdvYbDzBxaR4bz0ePiORqyHBfMtpPab5I4p2ENWCdIlwrg9T70mP-xcGDI2IR',
  'client_secret': 'EMW5L2QrLbDEYV2-opuW1N4213ZfUuUUrR9iJS_tu_sN4gBCi8aeHlCnWUXOvK_3I5G7SaV7F3qgO0gN'
});


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

// Learn More About Event Page
router.get("/learnmore", eventInfoController.getOneEvent,
 (req, res, next) => {
  console.log(req.data);
  data = req.data
  res.render('learnmore', {events: req.data});
});

router.get('/donate', ensureAuthenticated, (req, res) => res.render('donate'));

router.post('/pay', (req, res) => {
  price = req.body.amount;
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Donation",
                "sku": "001",
                "price": price,
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": price
        },
        "description": "Donation to event"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
    for(let i = 0;i < payment.links.length;i++){
      if(payment.links[i].rel === 'approval_url'){
        res.redirect(payment.links[i].href);
      }
    }
  }
});
});

router.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": price
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.redirect('/successfulDonation');
    }
});
});

router.get('/successfulDonation', (req, res) => res.render('successfulDonation'));

// Search function in nav bar
/*router.post("/search", req, res, next => {
  Event.findOne({ req.data })
  res.render('events', {events: req.data});
});
*/

router.post('/search', (req, res) => {   
  let body = '';     
  req.on('data', chunk => {         
    body += chunk.toString(); // convert Buffer to string
});
req.on('end', () => {
  Event.findOne({ 'eventName': body }).toArray( (err, results) => {
    console.log('got search')
    res.send(results)});
    });
  });





// My Profile Page
router.get('/myprofile', ensureAuthenticated, (req, res) =>
  res.render('myprofile', {
    user: req.user
  })
);

// User or Organization Register
router.get('/userororg_register', (req, res) => res.render('userororg_register'));

// User or Organization Login
router.get('/userororg_login', (req, res) => res.render('userororg_login'));

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