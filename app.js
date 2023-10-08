require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')
const passport = require('passport');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Database connection
require('./config/connectDB');

// pass the global passport object into the configuration function
require('./config/passport');

app.use(passport.initialize());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended : true}));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(methodOverride('_method'));

// routes

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const { verifyToken } = require('./utilities/token');

app.use(async (req,res,next)=>{
    
   
    passport.authenticate('jwt', function(err, user, info) {
        if (err) return next(err);

        if (!user){
            
            res.locals.user = null;
            return next();
        }

        req.user = user;
        res.locals.user = user;

        next();

    })(req, res, next);


    // try {
    //     const token = req.signedCookies.AT;
    //     let user = null;
    //     if(token){
    //         user = await verifyToken(token)
    //     }

    //     res.locals.user = user;
    //     console.log(res.locals.user);

    //     next();
    // } catch (error) {
    //     next(error);
    // }
})

app.use('/', productRoutes);
app.use('/user', userRoutes);
app.use('/cart',cartRoutes);
app.use('/admin',adminRoutes);


app.get('*', (req,res)=>{

    res.status(404).render('error/pagenotfound');

})

app.post('*', (req,res)=>{
    res.status(404).render('error/pagenotfound');
})

// Start Server

app.listen(PORT, ()=>{

    console.log(`Listening to the port : ${PORT}`);

})


