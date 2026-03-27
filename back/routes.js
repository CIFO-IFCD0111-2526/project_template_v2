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
// schema JOI para comprovar que los datos cumplen ------ // 

router.post("/signup", async (request, response) => {
    // logica de comprovacion de login //
    let { password, email } = request.body; // front tiene que mandar por body con los campos nombrados == 
    // ------------------------------------------comprobamos que contenga los campos --//
    if (password === undefined || email === undefined) {
        response
            .status(404)                                                          // aquesta part es podria treure xk el joi ja tornara error
            .json({ error: "Los datos enviados están en formato incorrecto" });   // en cas de que li arribi undefined, però entenc que és més
    } else {                                                                  // costós en càlcul el joi que això .
        // ---------------------------------------------aqui la comprovacion con joi ----//
        try {
            await UserSchema.validateAsync({ email, password });
        } catch (error) {
            return res.status(400).json({ error: error.details[0].message });
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
            response.status(500).json({ error: err.message });
        }
        if (userExists.length === 0) {
            console.log("el usuario no existe! Procedemos a crearlo");
            // Si el usuario no existe, lo creamos

            // -------------------------   encriptado de los datos de usuario , de momento el email no hace falta
            // ----------------------------- password = password encriptado | encriptem abans de enviar a la BBDD 
            const salt = bcrypt.genSaltSync(10);
            password = bcrypt.hashSync(password, salt);
            console.log("usuario guardado con el password encyptado: ", password , " de longitud : " , password.length )
            // ---------------------------------------------------------encriptado de los datos de usuario -- END //
            try {
                await pool.query(
                    `INSERT INTO users (email, password)
                            VALUES (?, ?);`, [email, password]
                );
                response.status(201).json({ message: "Usuario creado en DB correctamente" });
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