require('dotenv').config();
const express = require("express");
const router = new express.Router();
const pool = require("../mysql_conn.js");
const { authAPI } = require("../auth.middleware.js");

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

    res.status(200).json(rows);

  } catch (erro) {
    console.error("Erro:", erro.message);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
