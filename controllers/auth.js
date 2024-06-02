"use strict";
const { validationResult } = require("express-validator");
var Users = require("../models/users");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

var Users = require("../models/users");
var Sessions = require("../models/token");

var controller = {
    //creo mi función para ingresar
  login_user: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: 400, errors: errors.array() });
    }

    var data = req.body;
    Users.findOne({ email: data.email })
      .then((usuarios) => {
        console.log(usuarios);

        bcrypt.compare( data.password, usuarios.password, function (err, result) {
         
          if (result) {
        
            const payload = {
              user: usuarios,
            };
  
            let access_token = jwt.sign(payload, process.env.KEY, {
              expiresIn: "100d",
            });
  
            let today = new Date().toISOString();
  
            let update_session = {
              user: usuarios.email,
              key: access_token,
              creationDate: today,
              expirationDate: "100d",
              active: true,
            };
  
            Sessions.findOneAndUpdate({ user: usuarios.email }, update_session, {
              upsert: true,
              new: true,
            })
              .then((session) => {
                if (!session) {
                  return res.status(401).send({
                    status: 401,
                    message: "Usuario no encontrado",
                  });
                }
  
                return res.status(200).send({
                  status: 200,
                  message: "Login correcto",
                  token: access_token,
                });
              })
              .catch((error) => {
                console.error(error);
                return res.status(500).send({
                  status: 500,
                  message: "error detectado",
                });
              });
          } else {
            return res.status(401).send({
              status: 401,
              message: "Datos no validos",
            });
          }

        });

       
      })
      .catch((error) => {
        console.error(error);
        return res.status(401).send({
          status: 401,
          message: "Datos no validos",
        });
      });
  },

  //creo mi función para salir
  logout: function (req, res) {
    const token = req.headers["x-curso2024-access-token"];

    Sessions.findOneAndDelete({ user: req.decoded.user.email, key: token })
      .then((session) => {
        if (!session) {
          return res.status(200).send({
            status: 200,
            message: "Token invalido",
          });
        }
        return res.status(200).send({
          status: 200,
          message: "Sesion finalizada",
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({
          status: 500,
          message: "Token invalido",
        });
      });
  },
};
module.exports = controller;
