const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// GET - List user's notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.session.user.id });
    res.render("notes/index", { notes });
  } catch (err) {
    console.error(err);
    res.render("notes/index", { error: "An error occurred while retrieving notes" });
  }
});

// GET - Display form to create a new note
router.get("/create", (req, res) => {
  res.render("notes/create");
}).post("/create", async (req, res) => {
  const { title, content } = req.body;
  try {
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

// GET: Edit Note Form
router.get('/edit/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Note not found');
    }
    console.info(note);
    res.render('notes/edit', { note });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST/PUT: Update Note
router.post('/edit/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.redirect('/notes'); // Redirect to a page with all notes
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET: Confirm Delete Note
router.get('/confirm-delete/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.render('notes/confirm-delete', { note });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET: Delete Note
router.get('/delete/:id', async (req, res) => {
  try {
    const userId = req.session.user.id;
    await Note.findOneAndDelete({ _id: req.params.id, userId });
    res.redirect('/notes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
