const passport = require('passport');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


// -----------Configure Jwt Strategy

// i m saving token in the cookies that's why i have defined my custom jwt extractor
// for more go to docs
const cookieExtractor = function (req) {

  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies.AT;
  }
  return token;
};

// this is the options object , i,m gonna need to implement the
// JWT strategy
const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.SECRET_KEY,
};


// verifycallback will verify the user and return it
const verifyCallBack = async function (payload, done) {

  try {
    const user = await User.findOne({ _id: payload.sub });

    if (!user) return done(null, false);

    return done(null, user);

  } catch (error) {
    return done(err, false);
  }
}

const jwtStrategy = new JwtStrategy(options, verifyCallBack);

passport.use(jwtStrategy);


// --------------Configure Google Strategy-------------

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:8080/user/auth/google/callback",
},
  function (accessToken, refreshToken, profile, cb) {
    // console.log(profile);

    const { _json } = profile;

    // console.log(profile);

    const user = {

      username: _json.name,
      email: _json.email,
      googleId: _json.sub,
    }

    User.findOrCreate(user, function (err, user) {
      return cb(null, user);
    });

  }
));


// --------------Configure Facebook Strategy-------------

passport.use(new FacebookStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: "http://localhost:8080/user/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  function (accessToken, refreshToken, profile, cb) {

    // console.log(profile);

    const { _json } = profile;

    const user = {
      username: _json.name,
      email: _json.email,
      facebookId: _json.id,
    };
    User.findOrCreate(user, function (err, user) {
      return cb(err, user);
    });
  }
));
