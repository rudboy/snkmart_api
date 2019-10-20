const express = require("express");
const cors = require("cors");
const router = express.Router();
const body_parser = require("body-parser");
router.use(body_parser.json(), cors());
var isAuthenticated = require("../middlewares/isAuthenticated");
var uploadPictures = require("../middlewares/uploadPictures");
const POST = require("../models/Post_model");

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
    const all_key = await POST.find({}.key).populate("creator");
    //const alllist = await POST.find();
    res.json(all_key.reverse());
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.get("/post_by_creator", isAuthenticated, async (req, res) => {
  try {
    const user_id = req.user._id;
    const post_user = await POST.find({ creator: user_id }).populate("creator");
    res.json(post_user.reverse());
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

module.exports = router;
