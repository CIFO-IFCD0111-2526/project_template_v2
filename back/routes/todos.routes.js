const express = require("express");
const router = new express.Router();
const pool = require("../mysql_conn.js");
const { authAPI } = require("../auth.middleware.js");

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

// ------- -> DELETE <- -------

router.delete("/todos/:id", authAPI, async (req, res) => {
  const { email } = req.data;
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE t FROM tareas t
       INNER JOIN users u ON t.user_id = u.id
       WHERE t.id = ? AND u.email = ?`,
      [id, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "tarea borrada" });

  } catch (erro) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



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