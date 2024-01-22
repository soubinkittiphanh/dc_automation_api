require('dotenv').config()
const express = require("express");
const cors = require("cors");
const myRouter = require("./router")
const path = require('path');
const facebookController = require('./facebook').controller
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const expressSession = require('express-session');

const buildApp = async () => {
    const app = express();
    const GOOGLE_CLIENT_ID = '854785160029-os1k6kg6kqu7fedbmul2esrni3lmbvnv.apps.googleusercontent.com';
    const GOOGLE_CLIENT_SECRET = 'BuzoCOXyBnVzII6kxV7utDVX';
    const FACEBOOK_CLIENT_ID = '3613406232246933';
    const FACEBOOK_CLIENT_SECRET = '5ef819864c7a54d8de01d6881cdaa58c';
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/google'
    }, (accessToken, refreshToken, profile, callback) => {
        callback(null, profile);
    }))

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: '/facebook',
        profileFields: ['emails', 'displayName', 'name', 'picture']
    }, (accessToken, refreshToken, profile, callback) => {
        callback(null, profile)
    }))

    passport.serializeUser((user, callback) => {
        callback(null, user);
    })

    passport.deserializeUser((user, callback) => {
        callback(null, user);
    })
    app.set('view engine', 'ejs');
    // Set the views directory path
    app.set('views', path.join(__dirname, 'views'));
    app.use(expressSession({
        secret: 'jayantpatilapp',
        resave: true,
        saveUninitialized: true
    }))
    app.use(cors());
    app.use(express.json());
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/', (req, res) => {
        res.render('auth');
    });
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile email'] }));
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
    app.get('/auth/manual', facebookController.authenticate);
    app.get('/facebook', passport.authenticate('facebook', {
        failureRedirect: '/auth/facebook/error',
    }), facebookController.authenticate)
    app.get('/auth/facebook/signout', (req, res) => {
        // req.logout();
        // res.redirect('/');
        try {
            req.session.destroy((err) => {
                console.log('session destroyed.');
            });
            res.render('auth');
        } catch (err) {
            res.status(400).send({ message: 'Failed to sign out fb user' });
        }
    });

    app.get("/auth/succeed", (req, res) => {
        // ********* User authenticated! handler ************//
        // res.send(req.user ? req.user : 'Not logged in, login with Google or facebook');
        const user = req.user;
        res.render('fb-success', { user });

    })
    app.use("/api/user", myRouter.userRouter)
    app.use("/api/company", myRouter.companyRouter)
    return app;
}

module.exports = buildApp;