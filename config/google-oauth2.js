import passport from "passport";
import googleStrategy from 'passport-google-oauth'
import crypto from 'crypto'
import exp from "constants";

passport.use(new googleStrategy({
    clientID:'1058661846618-7dt1aadvse764l3227rc58kacbs51sup.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'http://localhost:5000/users/auth/google/callback'
    },
    (accessToken,refreshToken,profile,done)=>{
         
    }
))
// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: '1058661846618-7dt1aadvse764l3227rc58kacbs51sup.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
    clientSecret: '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', // e.g. _ASDFA%KFJWIASDFASD#FAD-
    callbackURL: "http://localhost:5000/users/auth/google/callback",
},

function(accessToken, refreshToken, profile, done){
    // find a user
    User.findOne({email: profile.emails[0].value}).exec(function(err, user){
        if (err){console.log('error in google strategy-passport', err); return;}
        console.log(accessToken, refreshToken);
        console.log(profile);

        if (user){
            // if found, set this user as req.user
            return done(null, user);
        }else{
            // if not found, create the user and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(err, user){
                if (err){console.log('error in creating user google strategy-passport', err); return;}

                return done(null, user);
            });
        }

    }); 
}


));

export default passport;
