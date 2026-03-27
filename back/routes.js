const express = require("express");
const router = new express.Router();
const pool = require("./mysql_conn.js");

const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { authAPI } = require("./auth.middleware.js");

// TODO: Equipo Back Express - implementar endpoints aqui
// Ver issues en GitHub para las tareas asignadas

module.exports = router;

// schema JOI para comprovar que los datos cumplen ------ //

const UserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

// ---------------------- LÓGICA DE SIGNIN ----------------------

router.post("/signin", async (request, response) => {
  const { email, password } = request.body;
  if (email === undefined || password === undefined) {
    response.status(404).json({ error: "Los datos enviados están en formato incorrecto" });
  } else {
    // Validación con Joi
    try {
      await UserSchema.validateAsync({ email, password });
    } catch (error) {
      return response.status(400).json({ error: error.details[0].message });
    }
    // Query a DB
    let results = [];
    try {
      [results] = await pool.query(
        `SELECT email, password FROM \`users\`
             WHERE email = ?`,
        [email],
      );
      //console.log(results);
    } catch (err) {
      console.error(err.message);
      response.status(500).json({ error: err.message });
    }
    // Comprobación de usuario y contraseña
    //console.log(results);
    if (results.length === 0) {
      console.log("El usuario no existe.");
      response.status(400).json({ error: "El usuario no existe." });
    } else if (!bcrypt.compareSync(password, results[0].password)) {
      console.log("La contraseña es incorrecta.");
      response.status(400).json({ error: "La contraseña es incorrecta." });
    } else {
      // Generar token de acceso
      const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // Cookie que le enviamos al nevagador automaticamente
      response.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // True en produccion https
        sameSite: "strict",
        maxAge: 3600000, // 1h
      }).json.status(200).json({
        message: "Inicio de sesión aceptado",
      });
    }
  }
});
