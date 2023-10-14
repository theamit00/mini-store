const express = require('express');
const router = express.Router();

router.get('/scholarship',(req,res)=>{

    res.render('coding-block-scholarship');

})

module.exports = router;