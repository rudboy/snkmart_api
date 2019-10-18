const express = require("express");
const cors = require("cors");
const router = express.Router();
const body_parser = require("body-parser");
router.use(body_parser.json(), cors());
var isAuthenticated = require("../middlewares/isAuthenticated");
var uploadPictures = require("../middlewares/uploadPictures");

const PRODUCT = require("../models/Product_model");

//Ajoute d'une sneaker
router.post("/create_product", isAuthenticated, uploadPictures, function(
  req,
  res,
  next
) {
  var obj = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    size: req.body.size,
    etat: req.body.etat,
    date: req.body.date,
    localisation: req.body.localisation,
    id_style: req.body.id_style,
    pictures: req.pictures,
    creator: req.user
  };

  try {
    const newProduct = new PRODUCT(obj);
    newProduct.save(function(err) {
      if (!err) {
        return res.json({
          _id: newProduct._id,
          title: newProduct.title,
          description: newProduct.description,
          price: newProduct.price,
          pictures: newProduct.pictures,
          created: newProduct.created,
          creator: {
            _id: newProduct.creator._id
          }
        });
      } else {
        return next(err.message);
      }
    });
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.get("/all_product", async (req, res) => {
  try {
    const all_key = await PRODUCT.find({}.key);
    const alllist = await PRODUCT.find();
    res.json(all_key);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

// Obtenir les infos d'un produit
router.get("/get_product_info", async (req, res) => {
  try {
    const product = await PRODUCT.findOne({ _id: req.query.id });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.post("/update_product_info", isAuthenticated, async function(req, res) {
  try {
    console.log(req.user._id);
    const newProduct = await PRODUCT.findOne({ creator: req.user._id });
    //console.log(newProduct);
    if (req.body.title) {
      newProduct.title = req.body.title;
    }
    if (req.body.description) {
      newProduct.description = req.body.description;
    }
    if (req.body.etat) {
      newProduct.etat = req.body.etat;
    }
    if (req.body.localisation) {
      newProduct.localisation = req.body.localisation;
    }
    if (req.body.price) {
      newProduct.price = req.body.price;
    }
    if (req.body.size) {
      newProduct.size = req.body.size;
    }
    if (req.body.id_style) {
      newProduct.id_style = req.body.id_style;
    }

    //modification a faire
    newProduct.save();
    res.json("update okay");
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});
router.get("/delete_product", async (req, res) => {
  try {
    const deleteproduct = await PRODUCT.findById({ _id: req.query.id });
    await deleteproduct.remove();
    res.json("Delete okay");
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.post("/Product", async (req, res) => {
  let NewParametre = {};
  let parameter = req.body;
  if ("id_style" in parameter) {
    NewParametre.id_style = req.body.id_style;
  }
  if ("title" in parameter) {
    NewParametre.title = new RegExp(req.body.title, "i");
  }
  if ("priceMin" in parameter && "priceMax" in parameter) {
    NewParametre.price = { $gt: req.body.priceMin, $lt: req.body.priceMax };
  }
  if ("priceMin" in parameter && !("priceMax" in parameter)) {
    NewParametre.price = { $gt: req.body.priceMin };
  }
  if ("priceMax" in parameter) {
    NewParametre.price = { $lt: req.body.priceMax };
  }
  if (req.body.sort === "price-asc") {
    const selectProduct = await PRODUCT.find(NewParametre).sort({ price: 1 });
    res.json(selectProduct);
  } else if (req.body.sort === "price-desc") {
    const selectProduct = await PRODUCT.find(NewParametre).sort({ price: -1 });
    res.json(selectProduct);
  }
  if (req.body.sort === "date-asc") {
    const selectProduct = await PRODUCT.find(NewParametre).sort({
      date: 1
    });

    res.json(selectProduct);
  } else if (req.body.sort === "date-desc") {
    const selectProduct = await PRODUCT.find(NewParametre).sort({
      date: -1
    });
    res.json(selectProduct);
  } else {
    const selectProduct = await PRODUCT.find(NewParametre);
    res.json(selectProduct);
  }
});

module.exports = router;
