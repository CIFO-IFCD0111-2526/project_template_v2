
// ------------------------------------ VALIDACIONES COMUNES
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarPassword(password) {
    return password && password.length >= 6;
}

// ------------------------------------  INICIALIZACIÓN DEL NAV
document.addEventListener("DOMContentLoaded", async () => {
    const nav = document.getElementById("nav");
    if (!nav) return;

    try {
        const res = await fetch("/api/v1/me");

        if (res.ok) {
            // Usuario con sesión activa
            nav.innerHTML = `
                <a href="/todos">Tareas</a>
                <a href="/me">Mi Cuenta</a>
                <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
            `;
            
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", async () => {
                    await fetch("/api/v1/logout", { method: "POST" });
                    window.location.href = "/";
                });
            }
        } else {
            // Usuario sin sesión
            nav.innerHTML = `
                <a href="/">SignUp</a>
                <a href="/">SignIn</a>
            `;
            
            // Protección de rutas privadas
            const path = window.location.pathname;
            if (path.includes("todos") || path.includes("me")) {
                window.location.href = "/";
            }
        }
    } catch (error) {
        console.error("Error al verificar sesión:", error);
    }
});