require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const server = new express();
const { authPage } = require("./auth.middleware.js");

require("./mysql_conn.js");
const userRoutes = require("./routes/user.routes.js");

const pageRoutes = require("./routes/pages.routes.js");
server.use("/", pageRoutes);

server.use(cookieParser());
server.use(express.json());

// Archivos estaticos publicos (CSS, JS del front)
server.use(express.static(path.join(__dirname, "../front")));

// API
server.use("/api/v1", userRoutes);

// Middleware 404 - debe ir al final de todas las rutas
server.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../front", "404.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor activo en http://localhost:" + PORT));

