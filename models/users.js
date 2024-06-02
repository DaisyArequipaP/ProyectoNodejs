'use strict'
    
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  iduser: Number,
  name: String,
  email: String,
  password: String,
  nombre: String,
  director: String,
  estudio: String,
  anio: Number,
  genero: Array,
  monto_invertido: Number,
  monto_recaudado: Number,
});
module.exports = mongoose.model("kidmovies", UserSchema); //kidmovies es la carpeta donde esta mi base de datos en mongoosedb
//ok no hacer cambios
