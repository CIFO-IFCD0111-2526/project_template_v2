require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const server = new express();
const { authPage } = require("./auth.middleware.js");

require("./mysql_conn.js");
const routes = require("./routes/user.routes.js");
const TodoRoutes = require("./routes/todos.routes.js");

server.use(cookieParser());
server.use(express.json());

// Archivos estaticos publicos (CSS, JS del front)
server.use(express.static(path.join(__dirname, "../front")));

// API
server.use("/api/v1", routes, TodoRoutes);

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

