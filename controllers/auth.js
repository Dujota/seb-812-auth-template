const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  // grab the data from the form req.body
  // see if the user already exists
  const userInDatabase = await User.findOne({ username: req.body.username });

  // tell FE that an error has occured if the user exists in db
  if (userInDatabase) {
    return res.send('Username or Password is invalid');
  }
  // figure out if the data submitted is valid
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password and Confirm Password must match');
  }

  // if they dont exist create the user in the database
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;
  const user = await User.create(req.body);
  // if the user successfully saves in the database, then we want to send a res to FE that the person signed in

  res.send(`Thanks for signing up ${user.username}`);
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
  // first lets check if the user exists in the database
  const userInDatabase = await User.findOne({ username: req.body.username });

  // tell FE that an error has occured if the user exists in db
  if (!userInDatabase) {
    // else let FE know sign in failed
    return res.send('Username or Password is invalid');
  }

  // if the user exists, then we want to vertify  if the password matches
  const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);

  if (!validPassword) {
    return res.send('Login failed. Please try again.');
  }

  // when the password matches, "sign them in"
  // save their username in teh session
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
    // isAdmin: userInDatabase.isAdmin
  };
  // send them to the homepage
  res.redirect('/');
});

router.get('/sign-out', (req, res) => {
  // destroy or delete the session using the built in session.destroy method
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
