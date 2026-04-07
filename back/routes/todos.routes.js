const express = require("express");
const router = new express.Router();
const pool = require("../mysql_conn.js");
const bcrypt = require("bcrypt");
const { authAPI } = require("../auth.middleware.js");
require('dotenv').config();

// const joi = require("joi"); 
// const jwt = require("jsonwebtoken"); se encarga el middleware authAPI 



// PUT /api/v1/todos/:id
router.put("/todos/:id", authAPI, async (req, res) => {
    // con authAPI nos aseguramos que el usuario está logueado y existe, (sinó ya se le ha direccionado a auth )
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

        let CAMBIO_OK = await pool.query( query , [ email , id ]  );
        // CAMBIO_OK retorna true o false si ha anat bé
        // console.log( "11", CAMBIO_OK[0].info         );
        // console.log( "12", CAMBIO_OK[0].serverStatus );
        // console.log( "13", CAMBIO_OK[0].affectedRows );
        // console.log( "14", CAMBIO_OK[0].changedRows  );
        
        let TAREA = await pool.query( `
            SELECT * from tareas 
                WHERE user_id  = ( select id from users where email = ? ) 
                    AND id  = ? ; ` 
            , [ email , id ] 
        );
        
        // console.log( "22" , TAREA,           ) ;
        //  console.log( "23" , TAREA[0][0]      ) ;
        // console.log( "24" , TAREA[0][0].id   ) ;
        // console.log( "25" , TAREA[0][0].titulo       ) ;
        // console.log( "26" , TAREA[0][0].completada   ) ;
        // console.log( "27" , TAREA[0][0].user_id      ) ;
        // console.log( "28" , TAREA[0][0].createdAt    ) ;
        return res.status(200).json(TAREA[0][0]) ; 
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



// ------- -> GET <- -------

router.get("/todos", authAPI, async (req, res) => {
  const { email } = req.data;

  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.titulo, t.completada, t.createdAt 
       FROM tareas t
       INNER JOIN users u ON t.user_id = u.id
       WHERE u.email = ?
       ORDER BY t.createdAt DESC`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(200).json({ message: "No se encontraron tareas", tasks: [] });
    }

    res.status(200).json(rows);

  } catch (erro) {
    res.status(500).json({ error: "Error interno" });
  }
});

// 




// ------- -> POST <- -------
// POST /api/v1/todos
router.post("/todos", authAPI, async (req, res) => {
  const { email } = req.data;
  const { titulo } = req.body;
  // Validar que titulo existe
  if (!titulo || titulo.trim() === "") {
    return res.status(400).json({ error: "Es obligatorio usar un título" });
  }
  try {
    //Buscar el user_id del usuario por email
    const [user] = await pool.query(
      "select id from users where email =?",
      [email]
    );
    if (user.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }
    const user_id = user[0].id;
    // INSERT INTO tareas (titulo, user_id) VALUES (?, ?)
    const [result] = await pool.query(
      `insert into tareas (titulo,user_id) VALUES(?,?)`,
      [titulo, user_id]
    );
    //Devolver la tarea creada con status 201
    res.status(201).json({
      message: "Tarea creada correctamente",
      task: {
        id: result.insertId,
        titulo,
        completada: 0,
        user_id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});


// mogut aqui baix perquè sinó no agafa els endpoints de sota. 

module.exports = router;
