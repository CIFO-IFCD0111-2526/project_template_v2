const express = require("express");
const router = new express.Router();
const path = require("path");
const { authPage } = require("../auth.middleware");

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../front/index.html"));
});
// Ruta-> para la pagina de Tareas
// GET /private -> /private -> private.html
server.get("/private", authPage, (request,response) => {
    response.sendFile(path.join(__dirname, '..' , 'front' , 'private.html'));
});

// Ruta-> Pagina de tareas (Privada)
// GET /me -> Sirve front/me.html
server.get("/me", authPage, (request,response) =>{
    response.sendFile(path.join(__dirname, '..' , 'front' , 'me.html'));
} );

module.exports = router;
