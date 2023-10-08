const passport = require('passport');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

// i m saving token in the cookies that's why i have defined my custom jwt extractor
// for more go to docs
const cookieExtractor = function(req) {

    // console.log(req.signedCookies);
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies.AT;
    }
    return token;
};

// this is the options object , i,m gonna need to implement the
// JWT strategy
const options = {
    jwtFromRequest : cookieExtractor,
    secretOrKey : process.env.SECRET_KEY,
};


// verifycallback will verify the user and return it
const verifyCallBack = async function(payload, done){

    try {
        const user = await User.findOne({_id: payload.sub});

        if(!user) return done(null, false);

        return done(null, user);

    } catch (error) {
        return done(err, false);
    }
}

const strategy = new JwtStrategy(options, verifyCallBack);

passport.use(strategy);