const express = require('express');
const router = express.Router();
const passport = require('passport');



router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/login' 
}),
  function(req, res) {

    res.send(req.user)

    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;