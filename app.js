const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const corsConfig = require('./configs/cors.config');

require('./configs/db.config');
require('./configs/passport.config').setup(passport);

const itemRoutes = require('./routes/item.routes')
const usersRoutes = require('./routes/users.routes');
const sessionRoutes = require('./routes/session.routes');

const app = express();

app.use(cors(corsConfig))

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRoutes);

app.use(session({
  secret: process.env.COOKIE_SECRET || 'Super Secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 2419200000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/items', itemRoutes);
app.use('/users', usersRoutes);
app.use('/session', sessionRoutes);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ message: error.message || '' });
});

module.exports = app;
