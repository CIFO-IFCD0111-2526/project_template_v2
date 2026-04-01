require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const server = new express();
const { authPage } = require("./auth.middleware.js");

require("./mysql_conn.js");
const routes = require("./router.auth.js");

server.use(cookieParser());
server.use(express.json());

// Archivos estaticos publicos (CSS, JS del front)
server.use(express.static(path.join(__dirname, "../front")));

// API
server.use("/api/v1", routes);

// Paginas
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../front", "index.html"));
});

// TODO: Aqui van las rutas de paginas privadas protegidas con authPage.

// Si no se encuentra el token o no es valido, se redirige a la pagina de login. Nuevas rutas privadas:

server.get("/me", authPage, (req, res) => {
     res.sendFile(path.join(__dirname, "../front", "me.html"));
 });

 // Lo mismo para la pagina privada, solo se puede acceder si el token es valido, sino se redirige a login.
 server.get("/todos", authPage, (req, res) => {
     res.sendFile(path.join(__dirname, "../front", "todos.html"));
 });
 

// Middleware 404 - debe ir al final de todas las rutas para garantizar que se ejecute solo si no se encuentra ninguna ruta anterior
server.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../front", "404.html"));
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor activo en http://localhost:" + PORT));



