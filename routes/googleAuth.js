const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const {createToken} = require('../utilities/token');
// require('dotenv/config');
const passport = require('passport');

router.get('/google', passport.authenticate('google', {scope: ['email','profile']}));

router.get('/google/callback',
  passport.authenticate("google", {
    failureRedirect: "/user/login",
    session:false
  }),
  async function (req, res) {

    const {user} = req;

    const token = await createToken(user);

    res.cookie('AT', token,{
        expires : new Date(Date.now() + 1000 * 60 * 30),
        httpOnly : true,
        signed : true
    });

    res.redirect('/');
  }
);

module.exports = router;