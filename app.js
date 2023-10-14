require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')
const passport = require('passport');
const path = require('path');
const ExpressError = require('./utilities/expressError');

const app = express();
const PORT = process.env.PORT || 8080;

// Database connection
require('./config/connectDB');

app.use(passport.initialize());

// pass the global passport object into the configuration function
require('./config/passport');


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
const codingBlocksRoutes = require('./routes/coding-blocks/scholarship');

app.use((req,res,next)=>{
    
   
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

})

app.use('/', productRoutes);
app.use('/user', userRoutes);
app.use('/cart',cartRoutes);
app.use('/admin',adminRoutes);
app.use('/codingblocks',codingBlocksRoutes);

app.all('*', (req,res,next)=>{

    // res.status(404).render('error/pagenotfound');

    const error = new ExpressError('Page Not Found',404);

    next(error);

})

// Error handler 
app.use((err,req,res,next)=>{

    // console.log(err);
    const {status = 500} = err; // default status if no status

    if(!err) err.message = 'Hamra Code Phat Gya';

    res.status(status).render('error/error',{err});

    // res.send(err);
})

// Start Server

app.listen(PORT, ()=>{

    console.log(`Listening to the port : ${PORT}`);

})


