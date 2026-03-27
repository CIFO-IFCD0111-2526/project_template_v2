const express = require("express");
const router = new express.Router();
const pool = require("./mysql_conn.js");

const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { authAPI } = require("./auth.middleware.js");

// TODO: Equipo Back Express - implementar endpoints aqui
// Ver issues en GitHub para las tareas asignadas

module.exports = router;


// schema JOI para comprovar que los datos cunmplen 

const UserSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
   
});
// schema JOI para comprovar que los datos cunmplen ------ // 





router.post("/signup", async (request, response) => {
  // logica de comprovacion de login //
  const { password, email } = request.body; // front tiene que mandar por body con los campos nombrados == 
  // ------------------------------------------comprobamos que contenga los campos --//
  if (  password === undefined || email === undefined) {
    response
      .status(404)
      .json({ error: "Los datos que nos envías SON BASURA" });
  } else {
    // ---------------------------------------------aqui la comprovacion con joi ----//
try {
        await UserSchema.validateAsync({  email , password });
    } catch (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // comprobado con joi que cumplen condiciones------------------------------------// 
    // Query a DB para ver si el usuario existe
    let userExists = [];
    try {
      [userExists] = await DBconnection.query(
        `SELECT nombre FROM \`usuario\`
             WHERE nombre = ?`,
        [nom],
      );
      console.log(userExists);
    } catch (err) {
      console.error(err.message);
      response.status(500).json({ error: err.message });
    }
    if (userExists.length === 0) {
      console.log("no existe!");
      // Si el usuario no existe, lo creamos
      try {
        await DBconnection.query(
          `INSERT INTO usuario (nombre, email, contraseña)
          VALUES (?, ?, ?);`, [nom, mail, pass]
        );
        response.status(201).json({ message : "Usuario creado en DB correctamente" });
      } catch (err) {
        console.error(err.message);
        response.status(500).json({ error: err.message });
      }
    } else {
      response.status(400).json({ error: "El usuario ya existe." });
    }
  }
});









































































// esto deberia ser la linai 150 