// app.js
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const session = require('express-session');
require('dotenv').config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authsRouter = require("./routes/auths");
var notesRouter = require("./routes/notes");
var tagsRouter = require("./routes/tags");

const loggedIn = require('./middlewares/logged-in');


var app = express();

// Express Session
app.use(session({
  secret: process.env.SECRET_KEY, // Replace with your actual secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 ngày (thời gian tồn tại của session)
    // Nếu bạn muốn session tồn tại lâu hơn, có thể tăng giá trị maxAge
  }
}));

// Middleware to pass current URL to views
app.use((req, res, next) => {
  res.locals.currentUrl = req.originalUrl;
  next();
});


// Middleware to pass user data to views
app.use((req, res, next) => {
  res.locals.user = req.session.user; // Assuming user is stored in req.session.user
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auths", authsRouter);
app.use("/notes", loggedIn, notesRouter);
app.use("/tags", tagsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("shared/error");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

console.info("INFO: App running in http://localhost:3000/");
module.exports = app;
