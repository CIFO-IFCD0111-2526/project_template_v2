require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const server = new express();
const { authPage } = require("./auth.middleware.js");

require("./mysql_conn.js");
const userRoutes = require("./routes/user.routes.js");
const todosRoutes = require("./routes/todos.routes.js");

// Reubicamos el middleware de autenticación para que se ejecute antes de las rutas de páginas.

server.use(cookieParser());    // Middleware para parsear cookies
server.use(express.json());    // Si ejecutamos las rutas antes las cookies no se parsean y no se puede validar el token.

const pageRoutes = require("./routes/pages.routes.js");
server.use("/", pageRoutes);



// Archivos estaticos publicos (CSS, JS del front)
server.use(express.static(path.join(__dirname, "../front")));

// API
server.use("/api/v1", userRoutes);
server.use("/api/v1", todosRoutes);
// Paginas
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../front", "index.html"));
});

// Paginas privadas protegidas con authPage
server.get("/me", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../front", "me.html"));
});

server.get("/todos", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../front", "todos.html"));
});

// Middleware 404 - debe ir al final de todas las rutas
server.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../front", "404.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor activo en http://localhost:" + PORT));
