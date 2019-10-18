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
    type: Array,
    default: []
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
    default: ""
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
