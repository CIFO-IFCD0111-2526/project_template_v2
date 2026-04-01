const express = require("express");
const router = new express.Router();
const path = require("path");
const { authPage } = require("../auth.middleware");


/**
 * Rutas Públicas
 */

// GET -> Página de inicio / Login (index.html)
router.get("/", (req, res) => {
    // Subimos dos niveles desde 'back/routes' para llegar a la raíz y entrar en 'front'
    res.sendFile(path.join(__dirname, "../../front/index.html"));
});

/**
 * Rutas Privadas (Protegidas)
 * Estas rutas requieren que el middleware 'authPage' valide el token de la cookie.
 */

// GET -> Listado de tareas (todos.html)
router.get("/todos", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../../front/todos.html"));
});

// GET -> Perfil de usuario (me.html)
router.get("/me", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../../front/me.html"));
});

module.exports = router;