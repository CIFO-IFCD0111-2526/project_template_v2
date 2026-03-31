require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const server = new express();
const { authPage } = require("./auth.middleware.js");

require("./mysql_conn.js");
const routes = require("./routes.js");

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

// TODO: Aqui van las rutas de paginas privadas protegidas con authPage
// Ejemplo:
// server.get("/private", authPage, (req, res) => {
//     res.sendFile(path.join(__dirname, "../front", "private.html"));
// });


// Ruta-> para la pagina de Tareas
// GET /private -> /private -> private.html
server.get("/private", authPage, (request,response) => {
    response.sendFile(path.join(__dirname, '..' , 'front' , 'private.html'));
});

// Ruta-> Pagina de tareas (Privada)
// GET /account -> Sirve front/account.html
server.get("/account", authPage, (request,response) =>{
    response.sendFile(path.join(__dirname, '..' , 'front' , 'account.html'));
} );


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor activo en http://localhost:" + PORT));

