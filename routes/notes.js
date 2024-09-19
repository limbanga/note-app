const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const Tag = require("../models/Tag");

// GET - List user's notes (with filter by tag and search functionality)
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auths/login");
  }

  const userId = req.session.user.id;
  const { tag, search } = req.query; // Lấy tag và search từ query string

  try {
    let notes;

    // Điều kiện tìm kiếm
    const searchQuery = search
      ? {
          $or: [
            { title: new RegExp(search, "i") }, // Tìm theo tiêu đề (không phân biệt chữ hoa/chữ thường)
            { content: new RegExp(search, "i") }, // Tìm theo nội dung
          ],
        }
      : {};

    // Nếu có tag trong query, chỉ lấy các note chứa tag đó và phù hợp với từ khóa tìm kiếm
    if (tag) {
      notes = await Note.find({
        userId: userId,
        Tags: tag,
        ...searchQuery,
      }).populate("Tags");
    } else {
      // Nếu không có tag, chỉ tìm kiếm các note phù hợp với từ khóa tìm kiếm
      notes = await Note.find({
        userId: userId,
        ...searchQuery,
      }).populate("Tags");
    }

    // Lấy tất cả tags để hiển thị trong bộ lọc
    const tags = await Tag.find({ userId: userId });

    res.render("notes/index", {
      notes,
      tags,
      selectedTag: tag,
      search,
      user: req.session.user,
      title: "Notes",
    });
  } catch (err) {
    console.error(err);
    res.render("notes/index", {
      error: "An error occurred while retrieving notes",
    });
  }
});

// GET - Display form to create a new note
router.get("/create", async (req, res) => {
  try {
    const tags = await Tag.find({ userId: req.session.user.id });
    res.render("notes/create", { tags });
  } catch (err) {
    console.error(err);
    res.render("notes/create", {
      error: "An error occurred while retrieving tags",
    });
  }
});

// POST - Handle note creation
router.post("/create", async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    // console.log(req.body);
    console.log("tags");
    console.log(tags);

    const newNote = new Note({
      title,
      content,
      userId: req.session.user.id,
      Tags: tags || [], // Nếu tags không được chọn, sẽ trả về mảng rỗng
    });

    await newNote.save();
    res.redirect("/notes");
  } catch (err) {
    console.error(err);
    const tags = await Tag.find({ userId: req.session.user.id });
    res.render("notes/create", {
      error: "An error occurred while creating the note",
      tags,
    });
  }
});

// GET - Display form to edit a note
router.get("/edit/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("Tags");
    if (!note) {
      return res.status(404).send("Note not found");
    }

    const tags = await Tag.find({ userId: req.session.user.id });
    res.render("notes/edit", { note, tags });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST - Handle note update
router.post("/edit/:id", async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, Tags: tags || [] },
      { new: true }
    );
    res.redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET: Confirm Delete Note
router.get("/confirm-delete/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }
    res.render("notes/confirm-delete", { note });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET: Delete Note
router.get("/delete/:id", async (req, res) => {
  try {
    const userId = req.session.user.id;
    await Note.findOneAndDelete({ _id: req.params.id, userId });
    res.redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
