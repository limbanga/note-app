var express = require("express");
var router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
var Tag = require("../models/Tag");

// GET all tags
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auths/login");
  }

  try {
    const tags = await Tag.find({ userId: new ObjectId(req.session.user.id) });
    console.log(tags);
    
    res.render("tags/index", { tags });
  } catch (err) {
    console.error(err);
    res.render("tags/index", {
      error: "An error occurred while retrieving tags",
    });
  }
});

// GET display form to create new tag
router.get("/create", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auths/login");
  }

  res.render("tags/create");
});

// POST handle tag creation
router.post("/create", async (req, res) => {
  const { name } = req.body;

  try {
    if (!req.session.user) {
      return res.redirect("/auths/login");
    }

    const newTag = new Tag({
      name,
      userId: req.session.user.id,
    });

    await newTag.save();
    res.redirect("/tags");
  } catch (err) {
    console.error(err);
    res.render("tags/create", {
      error: "An error occurred while creating the tag",
    });
  }
});

// GET display tag edit form
router.get("/edit/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).send("Tag not found");
    }
    res.render("tags/edit", { tag });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving tag");
  }
});

// POST handle tag edit
router.post("/edit/:id", async (req, res) => {
  const { name } = req.body;

  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).send("Tag not found");
    }

    tag.name = name;
    await tag.save();
    res.redirect("/tags");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while updating tag");
  }
});

// GET display tag deletion confirmation
router.get("/confirm-delete/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).send("Tag not found");
    }
    res.render("tags/confirm-delete", { tag });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving tag");
  }
});

// GET handle tag deletion
router.get("/delete/:id", async (req, res) => {
  try {
    await Tag.deleteOne({ _id: req.params.id });
    res.redirect("/tags");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting tag");
  }
});

module.exports = router;
