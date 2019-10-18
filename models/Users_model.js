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
    default:
      "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjxo7KarKXlAhUDVhoKHcxhDAgQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.iconfinder.com%2Ficons%2F172626%2Fmale_user_icon&psig=AOvVaw0DCI2JV9qIC5Rdm2SbG4-x&ust=1571472180022155"
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
