const express = require("express");
const router = new express.Router();
const pool = require("./mysql_conn.js");

const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { authAPI } = require("./auth.middleware.js");

// TODO: Equipo Back Express - implementar endpoints aqui
// Ver issues en GitHub para las tareas asignadas

module.exports = router;
