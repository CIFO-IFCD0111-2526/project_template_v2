const express = require("express");
const router = express.Router();
const path = require("path");
const { authPage } = require("../auth.middleware.js");

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../front", "index.html"));
});

router.get("/me", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../../front", "me.html"));
});

router.get("/todos", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../../front", "todos.html"));
});

module.exports = router;