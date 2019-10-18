const mongoose = require("mongoose");

const PRODUCT = mongoose.model("PRODUCT", {
  title: {
    type: String,
    default: "",
    require: true
  },
  description: {
    type: String,
    default: ""
  },
  id_style: {
    type: String
  },
  price: {
    type: Number,
    require: true
  },
  size: {
    type: Number,
    require: true
  },
  pictures: {
    type: Array,
    default: []
  },

  created: {
    type: Date,
    default: Date.now
  },
  etat: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  localisation: {
    type: Array,
    default: []
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER"
  }
});
module.exports = PRODUCT;
