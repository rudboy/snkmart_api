const mongoose = require("mongoose");

const POST = mongoose.model("POST", {
  text: {
    type: String,
    default: ""
    //require: true
  },
  category: {
    type: String,
    default: ""
  },

  pictures: {
    type: Array,
    default: []
  },

  created: {
    type: Date,
    default: Date.now
  },
  like: {
    type: Number,
    default: 0
  },
  comment: {
    type: Array,
    created: {
      type: Date,
      default: Date.now
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER"
    },
    text: {
      type: String,
      default: ""
    }
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER"
  }
});
module.exports = POST;
