const express = require('express');
const router = express.Router();
const {isLoggedIn, isAdmin} = require('../middleware');
const { handleLoginUser, handleLogoutUser, getLoginPage } = require('../controllers/user');



router.get('/', isLoggedIn, isAdmin,(req,res)=>{

    const admin = req.user;
    res.render('user/admin_dashboard',{admin});
})

router.get('/login', getLoginPage)

router.post('/login', handleLoginUser)


router.get('/logout', handleLogoutUser)

module.exports = router;
