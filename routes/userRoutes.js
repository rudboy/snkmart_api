const express = require("express");
const cors = require("cors");
const router = express.Router();
var isAuthenticated = require("../middlewares/isAuthenticated");
const body_parser = require("body-parser");
router.use(body_parser.json(), cors());
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const USER = require("../models/Users_model");
const mongoose = require("mongoose");
const api_key = "594ccaf6b4106bbbb1c5fe3d6cf2cdb8-acb0b40c-0968acfd";
const domain = "sandbox8fe5917dd2e14689a4c9878a063a0ffc.mailgun.org";
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

//Cree a compte utilisateur
router.post("/sign_up", async (req, res) => {
  try {
    // console.log(req.body.password);
    const password = req.body.password;
    const token = uid2(64);
    const salt = uid2(64);
    const hash = SHA256(password + salt).toString(encBase64);

    const newUser = new USER({
      nom: req.body.nom,
      prenom: req.body.prenom,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      size: req.body.size,
      token: token,
      salt: salt,
      password: hash
    });
    await newUser.save();
    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: {
        username: newUser.username,
        usermail: newUser.email
      }
    });
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

// Mot de passe oublié :
////////////////////////
router.post("/password_forgotten", async (req, res) => {
  const email = req.body.email;
  // Vérifier l'existence de l'adresse mail dans la base de données
  const user = await USER.findOne({ email });
  // Si elle existe : envoyer un mail avec un lien vers la page de reset
  if (user) {
    const data = {
      from: "Kevin <kevin.nkonda@live.fr>",
      to: email,
      subject: "Hello",
      text: "Click on the link below to change your password.",
      html: `<a href=https://snkmartapi.herokuapp.com/?token=${user.token}
          >Cliquez pour réinitialiser votre mot de passe</a>` // lien à changer
    };

    mailgun.messages().send(data, function(error, body) {
      if (error) {
        console.log(error);
      }
    });
    res.json("Message envoyé !");
  } else {
    // Sinon : afficher un message d'erreur
    res.json({ message: "Erreur dans l'adresse, veuillez réessayer." });
  }
});
////////////////////////

//Cree un compte utilisateur google
router.post("/google_connection", async (req, res) => {
  try {
    console.log("req.body", req.body.picture);

    const user = await USER.findOne({ email: req.body.email });

    if (user) {
      res.json({ token: user.token });
    } else {
      const token = uid2(64);
      const salt = uid2(64);

      const newUser = new USER({
        nom: req.body.familyName,
        prenom: req.body.givenName,
        username: req.body.username,
        email: req.body.email,
        picture: req.body.picture,
        token: token,
        salt: salt,
        password: req.body.password
      });
      await newUser.save();
      res.json({ token: newUser.token });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: { message: error.message } });
  }
});

//Cree un compte utilisateur facebook
router.post("/facebook_connection", async (req, res) => {
  try {
    console.log("req.body", req.body);

    const user = await USER.findOne({ email: req.body.email });

    if (user) {
      res.json({ token: user.token });
    } else {
      const token = uid2(64);
      const salt = uid2(64);

      const newUser = new USER({
        nom: req.body.familyName,
        prenom: req.body.givenName,
        username: req.body.username,
        email: req.body.email,
        token: token,
        salt: salt,
        password: req.body.password
      });
      await newUser.save();
      res.json({ token: newUser.token });
    }
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

//login compare les information envoyer et reçu
router.post("/login", async (req, res) => {
  try {
    const user = await USER.findOne({ email: req.body.email });
    if (user) {
      if (
        user.password ===
        SHA256(req.body.password + user.salt).toString(encBase64)
      ) {
        res.json({
          _id: user._id,
          token: user.token,
          account: {
            username: user.username,
            usermail: user.email
          }
        });
      } else {
        res.json("Le mot de passe est incorrect");
      }
    } else {
      res.json("Erreur dans l'adresse email");
    }
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.get("/get_my_user_info", async (req, res) => {
  try {
    const allinfo = await USER.findOne({ token: req.query.token });
    res.json(allinfo);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.post("/get_other_user_info", async (req, res) => {
  try {
    const verificaion = await USER.findOne({ token: req.body.token });
    if (verificaion) {
      const userInfo = await USER.findById({ _id: req.body.id });
      res.json({
        _id: userInfo._id,
        account: {
          username: userInfo.username,
          usermail: userInfo.email,
          phone: userInfo.phone
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.post("/update_user_info", isAuthenticated, async (req, res) => {
  try {
    // console.log("req body ", req.body);
    // console.log("req user ", req.user);

    if (req.body.email) {
      req.user.email = req.body.email;
    }
    if (req.body.nom) {
      req.user.nom = req.body.nom;
    }
    if (req.body.prenom) {
      req.user.prenom = req.body.prenom;
    }
    if (req.body.adresse) {
      req.user.adresse = req.body.adresse;
    }
    if (req.body.username) {
      req.user.username = req.body.username;
    }

    if (req.body.password) {
      const password = req.body.password;
      const salt = req.user.salt;
      const hash = SHA256(password + salt).toString(encBase64);
      req.user.password = hash;
      // console.log(req.user.password);
    }
    if (req.body.phone) {
      req.user.phone = req.body.phone;
    }

    if (req.body.favory) {
      console.log("req.body.favory ", req.body.favory);
      console.log("req.user.favory ", req.user.favory);

      const userFavsTab = req.user.favory;
      const favCheck = req.body.favory;
      let isInTab = false;
      let position = null;
      let ObjectId = mongoose.Types.ObjectId;

      console.log("userFavsTab ", userFavsTab);
      console.log("favCheck", favCheck);

      for (let i = 0; i < userFavsTab.length; i++) {
        if (userFavsTab[i] === ObjectId(favCheck)) {
          isInTab = true;
          position = i;
        }
      }
      console.log("isInTab ", isInTab);

      if (isInTab) {
        userFavsTab.splice(position, 1);
      } else {
        userFavsTab.push(ObjectId(favCheck));
      }
      console.log("userFavsTab ", userFavsTab);
      console.log("------------");

      req.user.favory = userFavsTab;
    }

    //modification a faire
    req.user.save();
    res.json("update okay");
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.post("/delete_user", async (req, res) => {
  try {
    const deleteUser = await USER.findOne({ token: req.body.token });
    await deleteUser.remove();
    res.json("Delete User okay");
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});
module.exports = router;
