const express = require('express');
const router = express.Router();
const passport = require('passport');
const {createToken} = require('../utilities/token');


router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/login',
    session: false,
}),
  async function(req, res, next) {

    try {
      const {user} = req;

      const token = await createToken(user);

      res.cookie('AT', token,{
        expires : new Date(Date.now() + 1000 * 60 * 30),
        httpOnly : true,
        signed : true
      });
      res.redirect('/');
    } catch (error) {
      next(error)
    }

  });

module.exports = router;