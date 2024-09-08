const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// GET - Display form to create a new note
router.get("/create", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auths/login"); // Redirect to login if not logged in
  }
  res.render("notes/create");
});

// POST - Handle note creation
router.post("/create", async (req, res) => {
  const { title, content } = req.body;

  try {
    if (!req.session.user) {
      return res.redirect("/auths/login"); // Redirect to login if not logged in
    }

    const newNote = new Note({
      title,
      content,
      userId: req.session.user.id,
    });

    await newNote.save();
    res.redirect("/notes");
  } catch (err) {
    console.error(err);
    res.render("notes/create", { error: "An error occurred while creating the note" });
  }
});

// GET - List user's notes
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auths/login");
  }

  try {
    const notes = await Note.find({ userId: req.session.user.id });
    res.render("notes/index", { notes });
  } catch (err) {
    console.error(err);
    res.render("notes/index", { error: "An error occurred while retrieving notes" });
  }
});

module.exports = router;
