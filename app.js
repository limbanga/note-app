// app.js
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const session = require('express-session');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authsRouter = require("./routes/auths");
var notesRouter = require("./routes/notes");



var app = express();

// Express Session
app.use(session({
  secret: 'your-secret2325-keysakfdhasjkd2352@#$@#sdaf', // Replace with your actual secret key
  resave: false,
  saveUninitialized: false,
}));

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
app.use("/notes", notesRouter);


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
  .connect("mongodb://localhost:27017/noteAppDB", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


module.exports = app;
