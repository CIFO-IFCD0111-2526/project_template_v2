const express = require("express");
const router = new express.Router();
const pool = require("../mysql_conn.js");

const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { authAPI } = require("../auth.middleware.js");


// schema JOI para comprovar que los datos cumplen ------ //

const UserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

// ---------------------- LÓGICA DE SIGNIN ----------------------

router.post("/signin", async (request, response) => {
  const { email, password } = request.body;
  if (email === undefined || password === undefined) {
    return response.status(404).json({ error: "Los datos enviados están en formato incorrecto" });
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
      return response.status(500).json({ error: "Error de base de datos" });
    }
    // Comprobación de usuario y contraseña
    //console.log(results);
    if (results.length === 0) {
      console.log("El usuario no existe.");
      return response.status(400).json({ error: "El usuario no existe." });
    } else if (!bcrypt.compareSync(password, results[0].password)) { // Comparar la contraseña que nos han pasado por parámetro con la almacenada encriptada en la DB
      // console.log("La contraseña es incorrecta.");
      return response.status(400).json({ error: "La contraseña es incorrecta." });
    } else {
      // Generar token de acceso
      const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // Cookie que le enviamos al navegador automáticamente
      response.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // True en producción https
        sameSite: "strict",
        maxAge: 3600000, // 1h
      }).status(200).json({
        message: "Inicio de sesión aceptado",
      });
    }
  }
});

router.post("/signup", async (request, response) => {
  // logica de comprovacion de login //
  let { password, email } = request.body; // front tiene que mandar por body con los campos nombrados == 
  // ------------------------------------------comprobamos que contenga los campos --//
  if (password === undefined || email === undefined) {
    return response
      .status(404)                                                          // aquesta part es podria treure xk el joi ja tornara error
      .json({ error: "Los datos enviados están en formato incorrecto" });   // en cas de que li arribi undefined, però entenc que és més
  } else {                                                                  // costós en càlcul el joi que això .
    // ---------------------------------------------aqui la comprovacion con joi ----//
    try {
      await UserSchema.validateAsync({ email, password });
    } catch (error) {
      return response.status(400).json({ error: error.details[0].message });
    }
    // comprobado con joi que cumplen condiciones------------------------------------// 
    // Query a DB para ver si el usuario existe
    let userExists = [];
    try {
      [userExists] = await pool.query(
        `SELECT email FROM \`users\`
                    WHERE email = ?`,
        [email],
      );
      //console.log(userExists);
    } catch (err) {
      console.error(err.message);
      return response.status(500).json({ error: "Error de base de datos" });
    }
    if (userExists.length === 0) {
      console.log("el usuario no existe! Procedemos a crearlo");
      // Si el usuario no existe, lo creamos
      // -------------------------   encriptado de los datos de usuario , de momento el email no hace falta
      // ----------------------------- password = password encriptado | encriptem abans de enviar a la BBDD 
      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(password, salt);
      // console.log("usuario guardado con el password encyptado: ", password, " de longitud : ", password.length)
      // ----------------------------------------------------------------------encriptado de los datos de usuario -- END //
      try {
        await pool.query(
          `INSERT INTO users (email, password)
                            VALUES (?, ?);`, [email, password]
        );
        return response.status(201).json({ message: "Usuario creado en DB correctamente" });
      } catch (err) {
        console.error(err.message);
        return response.status(500).json({ error: "Error de base de datos" });
      }
    } else {
      return response.status(400).json({ error: "El usuario ya existe." });
    }
  }
});
//get /me — nos devuelve datos del usuario logueado
router.get("/me", authAPI, async (request, response) => {
  const { email } = request.data;
  //consultamos a la BD
  let results = [];
  try {
    // usamos 'await' porque hablar con la base de datos lleva tiempo (es asíncrono)
    [results] = await pool.query(
      `select id, email, createdAt from \`users\`
        where email = ?`,// "?" prevenimos SQL injection
      [email]);
  } catch (err) {
    console.log(err.message);
    return response.status(500).json({ error: "Error de base de datos" });
  }
  //validación de seguridad extra
  if (results.length === 0) {
    return response.status(404).json({ error: "Usuario no encontrado" });
  }
  //respuesta final: enviamos solo lo necesario al front-end.
  return response.status(200).json({
    id: results[0].id,
    email: results[0].email,
    createdAt: results[0].createdAt,
  });
});

// post /logout — borramos la cookie de sesión
router.post("/logout", (request, response) => {
  response.clearCookie("accessToken", {
    httpOnly: true,     // seguridad: los scripts de js maliciosos no pueden leerla
    secure: false,    // en producción sería 'true' para exigir https
    sameSite: "strict", // seguridad: evita que la cookie se envíe desde otros sitios 
  });
  response.status(200).json({ message: "sesión cerrada correctamente" });
});


module.exports = router;