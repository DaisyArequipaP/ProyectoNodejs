'use estrict' 

require('dotenv').config();
var jwt = require("jsonwebtoken");

var Sessions = require('../models/token'); 

var middleware = {
  userprotectUrl: function (req, res, next) {
    const token = req.headers['x-kidmovies-access-token'];

    /*console.log(token);*/
    if(token){
      jwt.verify(token, process.env.KEY, (err, decoded) => {
          if(err){
              return res.status(401).send({
                  status:401,
                  message: "Token no valido"
              });
          } else {
              
              req.decoded = decoded;

              console.log(decoded);
              console.log(req.decoded.user.email);
              console.log(token);
              console.log({user:req.decoded.user.email, key: token, active:true});

              Sessions.findOne({user:req.decoded.user.email, key: token, active:true})
              .then(session =>{
                  console.log(session);
                  if(!session){
                      return res.status(401).send({
                          status:401,
                          message:"session no encontrada"
                      });
                  }

                  next();
              })
              .catch(error =>{
                  console.error(error);
                  return res.status(500).send({
                      status:500,
                      message:"error detectado",
                  });
              });
              
          }
      });
  }else{
      return res.status(401).send({
          status:401,
          message: "Datos no validos"
      });
  }
    
  }
};

module.exports = middleware;
