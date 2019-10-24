const express = require("express");
const cors = require("cors");
const router = express.Router();
const body_parser = require("body-parser");
router.use(body_parser.json(), cors());
var isAuthenticated = require("../middlewares/isAuthenticated");
var uploadPictures = require("../middlewares/uploadPictures");
const POST = require("../models/Post_model");
const USER = require("../models/Users_model");

//Ajoute d'une sneaker
router.post("/create_post", isAuthenticated, uploadPictures, function(
  req,
  res,
  next
) {
  var obj = {
    text: req.body.text,
    category: req.body.category,
    pictures: req.pictures,
    creator: req.user
  };

  try {
    const newPost = new POST(obj);
    newPost.save(function(err) {
      if (!err) {
        return res.json({ result: "Post_creat_ok" });
        // return res.json({
        //   _id: newPost._id,
        //   text: newPost.text,
        //   category: newPost.category,
        //   pictures: newPost.pictures,
        //   created: newPost.created,
        //   creator: {
        //     _id: newPost.creator._id
        //   }
        //});
      } else {
        return next(err.message);
      }
    });
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.get("/all_post", async (req, res) => {
  try {
    const all_key = await POST.find({}.key).populate({
      path: "creator",
      select: { username: 1, picture: 1 }
    });
    //const alllist = await POST.find();
    res.json(all_key.reverse());
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.get("/post_by_creator", isAuthenticated, async (req, res) => {
  try {
    const user_id = req.user._id;
    const post_user = await POST.find({ creator: user_id }).populate({
      path: "creator",
      select: { username: 1, picture: 1 }
    });
    res.json(post_user.reverse());
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.post("/post_info", isAuthenticated, async (req, res) => {
  try {
    const id_post = req.body.post;
    const info_post = await POST.findOne({ _id: id_post }).populate({
      path: "creator",
      select: { username: 1, picture: 1 }
    });
    res.json(info_post);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.post("/post_comment", isAuthenticated, async (req, res) => {
  try {
    const text = req.body.post;
    const name = req.body.name;
    const picture = req.body.picture;
    const id = req.body.id;
    const date = Date.now();

    const info_post = await POST.findOne({ _id: id }).populate({
      path: "creator",
      select: { username: 1, picture: 1 }
    });
    info_post.comment.push({
      text: text,
      name: name,
      picture: picture,
      date: date
    });
    if (req.user._id !== info_post.creator._id) {
      let creator = await USER.findOne({ _id: info_post.creator._id });
      res.json(creator);

      creator.notification.push({
        id: req.user._id,
        username: req.user.username,
        action: "comment",
        post: id
      });
    }
    creator.save();
    info_post.save();
    res.json(info_post);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

module.exports = router;
