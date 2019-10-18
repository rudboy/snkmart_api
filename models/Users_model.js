const mongoose = require("mongoose");

const USER = mongoose.model("USER", {
  email: {
    type: String,
    require: true,
    unique: true
  },
  nom: {
    type: String,
    default: "",
    require: true
  },
  prenom: {
    type: String,
    default: "",
    require: true
  },
  adresse: {
    type: String,
    default: ""
  },
  favory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "POST"
  },
  username: {
    type: String,
    default: "",
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  picture: {
    type: String,
    default:
      "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"
  },
  phone: {
    type: Number,
    default: ""
  },
  token: String,
  hash: String,
  salt: String,
  size: {
    type: String,
    default: ""
  }
});
module.exports = USER;
