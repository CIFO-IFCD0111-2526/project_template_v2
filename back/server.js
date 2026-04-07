require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const server = new express();
//Conexiones y middlewares de seguridad
require("./mysql_conn.js");
const { authPage } = require("./auth.middleware.js");

//Middlewares globales
server.use(cookieParser());
server.use(express.json());

// Importacion de Rutas
const userRoutes = require("./routes/user.routes.js");
const todosRoutes = require("./routes/todos.routes.js")
const pageRoutes = require("./routes/pages.routes.js");
// Archivos estaticos publicos (CSS, JS del front)
server.use(express.static(path.join(__dirname, "../front")));
// API
server.use("/api/v1", userRoutes);
server.use("/api/v1", todosRoutes);
server.use("/", pageRoutes);

// Middleware 404 
server.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../front", "404.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 Servidor activo en http://localhost:${PORT}`);
    console.log(`✅ Rutas de usuario montadas en /api/v1`);
    console.log(`✅ Rutas de tareas montadas en /api/v1`);
});