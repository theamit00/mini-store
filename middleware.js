const {userValidationSchema, productValidationSchema} = require('./validationSchemas');
const {verifyToken} = require('./utilities/token');
const User = require('./models/user');
const passport = require('passport');

const validateUser = (req,res,next)=>{

    const {value, error} = userValidationSchema.validate(req.body);

    if(error){
        const message = error.details.map((el)=> el.message).join(',');

        console.log(message);
    }
    else{
        next();
    }
}

const validateProduct = (req,res,next)=>{

    const {value, error} = productValidationSchema.validate(req.body);

    if(error){
        const message = error.details.map((el)=>el.message).join(',');
        console.log(message);
    }

    else{
        next();
    }
}


// const isLoggedIn = async (req,res,next)=>{

//     let requestedUrl = req.originalUrl === '/cart/checkout'? '/cart' : '';

//     res.cookie('strl', requestedUrl, {
//         expires : new Date(Date.now() + 1000 * 60),
//         httpOnly : true,
//         signed : true
//     })

//     try {
//         const token = req.signedCookies.AT;

//         const {_id} = await verifyToken(token);

//         const user = await User.findById(_id);
    
//         if(!user){
//             console.log('You must be logged in');
//             return res.redirect('/user/login');
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.log(error);
//     }
// }


const isLoggedIn = async function(req, res, next){
    passport.authenticate('jwt', function(err, user, info) {
        if (err) return next(err);

        if (!user){
            console.log('You must be logged in');
            return res.redirect('/user/login');
        }

        req.user = user;

        next();

    })(req, res, next);
};

const isAdmin = (req,res,next)=>{

    const user = req.user;

    if(user.role !== 'admin') {
        return res.send(`Sorry you don't have accces to this route`);
    }

    next();
}

// const returnTo = (req,res,next)=>{

//     if(req.signedCookies.strl){

//         res.locals.returnTo = req.signedCookies.strl;
//         res.clearCookie('strl');
//     }
//     next();
// }


module.exports = {
    validateUser,
    validateProduct,
    isLoggedIn,
    isAdmin,
    // returnTo,
}