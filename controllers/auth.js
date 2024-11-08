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

module.exports = router;
