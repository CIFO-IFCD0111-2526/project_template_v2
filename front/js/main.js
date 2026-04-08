
// ------------------------------------ Validación manual (sustituye a Joi)

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarPassword(password) {
  return password.length >= 6;
}

// ------------------------------------ NAV dinámico
document.addEventListener("DOMContentLoaded", async () => {
  const nav = document.getElementById("nav");
  if (!nav) return;

  try {
    const res = await fetch(`${API_URL}/api/v1/me`);

    if (res.ok) {
      nav.innerHTML = `
                <a href="/todos">Tareas</a>
                <a href="/me">Mi Cuenta</a>
                <button id="logoutBtn">Cerrar Sesión</button>
            `;
      const logoutBtn = document.getElementById("logoutBtn");

      logoutBtn.addEventListener("click", async () => {
          try {
              await fetch(`${API_URL}/api/v1/logout`, { method: "POST" });
              localStorage.removeItem("accessToken");
              window.location.href = "/";
          } catch (error) {
              console.error("Error al hacer logout", error);
          }
      });
    } else {
      nav.innerHTML = `
                <a href="/">SignUp</a>
                <a href="/">SignIn</a>
            `;
    }
  } catch (error) {
    console.error("Error al verificar la sesión", error);
    nav.innerHTML = `
            <a href="/">SignUp</a>
            <a href="/">SignIn</a>
        `;
  }
});
