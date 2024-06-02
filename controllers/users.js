"use estrict";
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

var Users = require("../models/users");

var controller = {
  //para visualizar la lista de usuarios
  userlist: function (req, res) {
    Users.find({})
      .then((usuarios) => {
        console.log(usuarios);
        return res.status(200).send({
          status: 200,
          message: "Usuarios Listados",
          data: usuarios,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({
          status: 500,
          message: "error detectado",
        });
      });
  },
  //para visualizar a un usuario en particular
  userSingular: function (req, res) {
    var params = req.params;
    var iduser = params.iduser;
    Users.findOne({ iduser: parseInt(iduser) })
      .then((usuarios) => {
        console.log(usuarios);
        return res.status(200).send({
          status: 200,
          message: "Información de usuario",
          data: usuarios,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({
          status: 500,
          message: "error detectado",
        });
      });
  },

  //crear un nuevo usuario
  createuser: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: 400, errors: errors.array() });
    }

    var data = req.body;

    //validacion en caso de que sea un usuario existente
    Users.findOne({ iduser: data.iduser })
      .then((usuarios) => {
        console.log(usuarios);
        if (usuarios) {
          return res.status(400).send({
            status: 400,
            message: "Usuario existente",
          });
        }

        //hasear la contraseña
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(data.password, salt, function (err, hash) {
            //creamos el nuevo usuario
            //poner la contrasena
            //usuarios con encriptacion
            var create_user = new Users();
            create_user.iduser = data.iduser;
            create_user.name = data.name;
            create_user.email = data.email;
            create_user.nombre = data.nombre;
            create_user.director = data.director;
            create_user.estudio = data.estudio;
            create_user.anio = data.anio;
            create_user.genero = data.genero;
            create_user.monto_invertido = data.monto_invertido;
            create_user.monto_recaudado = data.monto_recaudado;
            create_user.password = hash;

            create_user
              .save()
              .then((result) => {
                return res.status(200).send({
                  status: 200,
                  message: "Usuario Almacenado",
                  data: result,
                });
              })
              .catch((error) => {
                console.error(error);
                return res.status(500).send({
                  status: 500,
                  message: "error detectado",
                });
              });
          });
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({
          status: 500,
          message: "error detectado",
        });
      });
    // fin validacion de usuario existente
  },
 
  //para actualizar un usuario existente
  updateuser: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: 400, errors: errors.array() });
    }

    var params = req.params;
    var iduser = params.iduser;

    var data = req.body;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(data.password, salt, function (err, hash) {
        var update_user = {
          iduser: data.iduser,
          name: data.name,
          email: data.email,
          password: hash,
          nombre: data.nombre,
          director: data.director,
          estudio: data.estudio,
          anio: data.anio,
          genero: data.genero,
          monto_invertido: data.monto_invertido,
          monto_recaudado: data.monto_recaudado,
        };

        Users.findOneAndUpdate({ iduser: parseInt(iduser) }, update_user)
        //buscar el usuario
          .then((usuarios) => {
            if (!usuarios) {
              return res.status(200).send({
                status: 200,
                message: "Usuario no encontrado",
              });
            }
           //actualizar el usuario
            return res.status(200).send({
              status: 200,
              message: "Usuario actualizado",
            });
          })
          .catch((error) => {
            console.error(error);
            return res.status(500).send({
              status: 500,
              message: "error detectado",
            });
          });
      });
    });
  },
//para borrar el usuraio
  deleteuser: function (req, res) {
    var params = req.params;
    var iduser = params.iduser;

    Users.findOneAndDelete({ iduser: parseInt(iduser) })
    //buscamos el usuario para eliminarlo
      .then((usuarios) => {
        if (!usuarios) {
        }
        return res.status(200).send({
          status: 200,
          message: "Usuario eliminado",
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({});
      });
  },
};

module.exports = controller;
