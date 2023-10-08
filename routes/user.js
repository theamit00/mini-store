const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const {validateUser, isLoggedIn, returnTo} = require('../middleware');

const {createToken} = require('../utilities/token');
const { handleLoginUser, handleLogoutUser, getLoginPage } = require('../controllers/user');

const googleAuth = require("./googleAuth");

router.use('/auth', googleAuth);

router.get('/', isLoggedIn, (req,res)=>{

    const user = req.user;

    if(user.role === 'admin') return res.status(401).json({message : `Sorry you don't have accces to this route`})

    res.render('user/user_dashboard',{user});

})

router.get('/register', (req,res)=>{

    res.render('user/register');

})

router.post('/register', validateUser, async (req,res,next)=>{

    try {
        
        const {username, email, password} = req.body;

        const newUser = new User({username, email, password});

        const user = await newUser.save();
        
        const token = await createToken(user);

        res.cookie('AT', token,{
            expires : new Date(Date.now() + 1000 * 60 * 30),
            httpOnly : true,
            signed : true
        });

        res.redirect('/user/');

    } catch (error) {
        next(error);
    }

})

router.get('/login', getLoginPage)

router.post('/login', handleLoginUser)

router.get('/logout', handleLogoutUser)

router.put('/:id/balance', isLoggedIn, async (req,res,next)=>{
    try {
        const {amount} = req.body;
        const user = req.user;

        if(+amount < 50 ){
        return res.json({message : 'Amount should be greater than 50'});
        }

        let changeInBalance = +amount;
        await User.findAndCreditBalance(user, changeInBalance);
        res.redirect(`/user`)
    } catch (error) {
        next(error);
    }
})

module.exports = router;