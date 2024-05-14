const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const router = express.Router();
const auth = require("../Middleswares/auth");
const { RegisterValidation, LoginValidation } = require("../validation");
const users = require("../models/users");
require("dotenv/config");

router.get("/Alluser", (req, res, next) => {
  users
    .find()
    .exec()
    .then((items) => {
      console.log(items);
      res.status(200).json(items);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.delete("/deleteuser/:id", (req, res, next) => {
  const id = req.params.id;
  users
    .findOneAndRemove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.get("/", auth, async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new Error("Authentication failed");
    }
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
});

router.get("/Coach", async (req, res) => {
  try {
    // const fullGroupe = await groupe.aggregate(aggregation);
    const Coach = await User.find({ type: "Coach" });
    res.status(200).json(Coach);
  } catch (error) {
    res.status(500).json({
      message: "error ",
    });
  }}
);
  router.post("/register2", async (req, res) => {
    try {
      const { nom, prenom, motDePasse, email, type } = req.body;

      // Hachage du mot de passe
      const hash = await bcryptjs.hash(motDePasse, 10);

      // Création d'un nouvel utilisateur avec les données fournies
      const newUser = new User({
        nom,
        prenom,
        motDePasse: hash, // Stockage du mot de passe haché
        email,
        type,
      });

      // Enregistrement de l'utilisateur dans la base de données
      await newUser.save();

      res.status(201).json({
        message: "Utilisateur enregistré avec succès",
        user: newUser,
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement de l'utilisateur :",
        error
      );
      res.status(500).json({
        message:
          "Une erreur est survenue lors de l'enregistrement de l'utilisateur",
        error: error.message,
      });
    }
  });


// router.post("/register", async (req, res, next) => {
//   // message d'erreur (verifier data )
//   const { error } = RegisterValidation(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   let { nom, prenom, motDePasse, email, type, groupId } = req.body;
//   if (!nom || !prenom || !motDePasse || !email|| !type) {
//     return res.status(400).json({ message: "Bad input", success: false });
//   }
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(401).json({
//         message: "User already exits.",
//         success: false,
//       });
//     }
//     // hash mot de passe
//     bcryptjs.hash(motDePasse, 10, async (hashError, hash) => {
//       if (hashError) {
//         return res.status(500).json({
//           message: hashError.message,
//           error: hashError,
//         });
//       }

//       const _user = new User({
//         _id: new mongoose.Types.ObjectId(),
//         nom,
//         prenom,
//         email,
//         type,
//         groupId,
//         motDePasse: hash,
//       });
//       // save user
//       await _user.save();
//       return res.status(201).json({
//         message: "User Created",
//         user: _user,
//         success: true,
//       });
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//       error,
//     });
//   }
// });

router.post("/login", async (req, res, next) => {
  // message d'erreur (verifier data )
  const { error } = LoginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { email, motDePasse } = req.body;
  try {
    // chercher si le user est existe !!
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
        success: false,
      });
    }
    // verifier le mot de passe saisir avec le mot de passe existe sur BD
    const isMatch = await bcryptjs.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Mot de passe",
        success: false,
      });
    }

    const payload = {
      user: {
        id: user.id,
        type: user.type,
      },
    };
    // create et assign token
    jwt.sign(payload, process.env.token, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        message: "Authentication Successful",
        token,
        user,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});
router.delete("/deleteuser/:id", (req, res, next) => {
  const id = req.params.id;
  users
    .findOneAndRemove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
