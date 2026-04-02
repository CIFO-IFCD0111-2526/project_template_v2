require('dotenv').config();
const express = require("express");
const router = new express.Router();
const pool = require("../mysql_conn.js");
const { authAPI } = require("../auth.middleware.js");

// ------- -> GET <- -------

router.get("/todos", authAPI, async (req, res) => {
  const {email} = req.data;

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
      return res.status(200).json({message:"No se encontraron tareas", tasks:[]});
    }

    res.status(200).json(rows);

  } catch (erro) {
    res.status(500).json({ error: "Error interno" });
  }
});

// 

// ------- -> DELETE <- -------

router.delete("/todos/:id", authAPI, async (req, res) => {
  const {email} = req.data;
  const {id} = req.params;

  try {
    const [result] = await pool.query(
      `DELETE t FROM tareas t
       INNER JOIN users u ON t.user_id = u.id
       WHERE t.id = ? AND u.email = ?`,
      [id, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({error:"Tarea no encontrada"});
    }

    res.status(200).json({message:"tarea borrada"});

  } catch (erro) {
    res.status(500).json({error:"Error interno del servidor"});
  }
});

module.exports = router;