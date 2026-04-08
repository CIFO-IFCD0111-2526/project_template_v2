const express = require("express");
const router = express.Router();
const path = require("path");
const { authPage, authAPI } = require("../auth.middleware.js");

router.get("/", authPage , (req, res) => { // SI NO PASA AUTH, se manda automaticamente a login, si lo pasa, lo mandamos a /todos 
    res.sendFile(path.join(__dirname, "..", "..", "front", "todos.html"));
});

router.get("/me", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "..",".." ,"front", "me.html"));
});

router.get("/todos", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "front", "todos.html"));
});

module.exports = router;