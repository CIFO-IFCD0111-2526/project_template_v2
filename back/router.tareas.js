const express = require("express");
const routerTareas = new express.Router();
const pool = require("./mysql_conn.js");
const joi = require("joi");
// const jwt = require("jsonwebtoken");
const { authAPI } = require("./auth.middleware.js");
const cookieParser = require("cookie-parser");
const path = require("path");


require("./mysql_conn.js");
require('dotenv').config();
/*
// const server = new express();
// const router = require("./routes.js");
server.use(cookieParser());
server.use(express.json());
// Archivos estaticos publicos (CSS, JS del front)
server.use(express.static(path.join(__dirname, "..", "front")));
// API
server.use("/api/v1", routes);
*/
//evisar, borrar i  configurar antes de enviar /
////////////////////////////////////////////////

routerTareas.get("/tareas", async (request, response) => { 
    response.status(200).json("OK")  ;
    console.log( "acceso GET a /tareas")} ); 

routerTareas.post("/tareas", async (request, response) => {  
    response.status(200).json("OK")  ;
    console.log( "acceso POST a /tareas") 
    } ); 

routerTareas.put("/tareas/:id", async (request, response) => { 
    response.status(200).json("OK")  ;
    console.log( "acceso PUT a /tareas/" , request.params.id,) 
} ); 

routerTareas.delete("/tareas/:id", async (request, response) => {
    response.status(200).json("OK") ;
    console.log( "acceso DELETE a /tareas/" , request.params.id) 
} );  





module.exports = routerTareas;


