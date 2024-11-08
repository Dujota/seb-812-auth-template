require('dotenv').config();
require('./config/database');
const express = require('express');

const app = express();
const methodOverride = require('method-override');
const morgan = require('morgan');

// Controllers
const authCtrl = require('./controllers/auth');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// MIDDLEWARE

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

// Public Routes
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.use('/auth', authCtrl);

// Protected Routes

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
