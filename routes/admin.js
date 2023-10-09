const express = require('express');
const router = express.Router();
const {isLoggedIn, isAdmin} = require('../middleware');


router.get('/', isLoggedIn, isAdmin,(req,res)=>{

    const admin = req.user;
    res.render('user/admin_dashboard',{admin});
})

module.exports = router;
