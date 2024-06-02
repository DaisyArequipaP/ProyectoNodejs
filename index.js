'use estrict' 
//sea mas extricto el java en ciertas cosas
const mongoose = require('mongoose'); //reconozca la base de datps mongoose atlas libreria
var app = require('./app'); // importar datos de app
var port = 3000; // importamos el servidor local

//lamamos a una promesa: que algo se debe cumplir
//nos permite tener la coneccion abierta
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://daisyarequipapalma:6h87DQgrbFKZDgqa@cluster0.sbr81gs.mongodb.net/movies", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Conexión a la base de datos establecido con exito");
        var index = app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
          });
        index.timeout = 120000;
    })
    .catch(err => console.log(err));