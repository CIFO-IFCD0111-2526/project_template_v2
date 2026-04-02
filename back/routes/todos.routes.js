const express = require("express");
const router = new express.Router();
const pool = require("../mysql_conn.js");
const bcrypt = require("bcrypt");
const { authAPI } = require("../auth.middleware.js");

// const joi = require("joi"); 
// const jwt = require("jsonwebtoken"); se encarga el middleware authAPI 



// PUT /api/v1/todos/:id
router.put("/todos/:id", authAPI, async (req, res) => {
    // con authAPI nos aseguramos que el usuario está logueado y existe, sinó ya se le ha direccionado
    const { email } = req.data; // será el "nombre de usuario" del token ( en middleware se crea el data )
    const { id } = req.params;  // const id = req.params.id // per si voleguessim donar-li un altre nom a la variable ( i igual en email ) 
        
    /* 
    // SQL REQUEST 
    //buscamos la tarea del usuario "email" con id "id" 
    // cambiamos el estado de completada ( invertimos el booleano con " NOT completada " )
    */
    const query =`
        UPDATE tareas 
        set completada = NOT completada   
            WHERE  user_id  = ( select id from users where email = ? ) 
                    AND id  = ? ; ` 
    // añadir a la query para "rellenar" los campos [ email , id ] 
    
    try { 
        let [CAMBIO_COMPLETADA] = await pool.query( query , [ email , id ]  );  
    }
    catch ( err ) { 
        console.log(err);
        return res.status(500).json({ error: err.message });
    } 
    finally {
        


    } ;

    
    
    // 1. Buscar el user_id del usuario por email
    // 2. Verificar que la tarea existe Y pertenece al usuario
    //    SELECT * FROM tareas WHERE id = ? AND user_id = ?
    // 3. Toggle: UPDATE tareas SET completada = NOT completada WHERE id = ?
    // 4. Devolver la tarea actualizada con status 200
});