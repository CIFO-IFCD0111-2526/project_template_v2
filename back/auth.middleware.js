const jwt = require('jsonwebtoken');

// Middleware para rutas API (responde JSON)
function authAPI(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: "No autenticado" });
    }
    try {
        req.data = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token invalido o expirado" });
    }
}

// Middleware para paginas HTML (redirige a /)
function authPage(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.redirect("/");
    }
    try {
        req.data = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.clearCookie("accessToken");
        return res.redirect("/");
    }
}

// Middleware para redirigir a /todos si ya está logueado
function redirectIfLogged(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token) return next();
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.redirect("/todos");
    } catch (error) {
        res.clearCookie("accessToken");
        next();
    }
}

module.exports = { authAPI, authPage, redirectIfLogged };
