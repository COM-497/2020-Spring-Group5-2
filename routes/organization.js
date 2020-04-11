const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const orgPassport = require('passport');

// Organization Model
const Org = require('../models/Org');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/orglogin', (req, res) => res.render('orglogin'));

// Register Page
router.get('/orgregister', (req, res) => res.render('orgregister'));

// Register
router.post('/orgregister', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(org => {
        if (org) {
          errors.push({ msg: 'Email already exists' });
          res.render('orgregister', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newOrg = new Org({
            name,
            email,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newOrg.password, salt, (err, hash) => {
              if (err) throw err;
              newOrg.password = hash;
              newOrg
                .save()
                .then(org => {
                  req.flash(
                    'success_msg',
                    'You are now registered as an organization and can log in'
                  );
                  res.redirect('/organization/orglogin');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

// Org Login
router.post('/orglogin', (req, res, next) => {
    passport.authenticate('local.two', {
      successRedirect: '/myprofile',
      failureRedirect: '/organization/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Org Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/organization/login');
  });

module.exports = router;