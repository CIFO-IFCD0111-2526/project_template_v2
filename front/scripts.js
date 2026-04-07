const forms = document.querySelectorAll("form");
const signInRES = document.querySelector("#signInRES");
const signUpRES = document.querySelector("#signUpRES");

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
    const res = await fetch("/api/v1/me");

    if (res.ok) {
      nav.innerHTML = `
                <a href="/todos">Tareas</a>
                <a href="/me">Mi Cuenta</a>
                <button id="logoutBtn">Cerrar Sesión</button>
            `;
      const logoutBtn = document.getElementById("logoutBtn");

      logoutBtn.addEventListener("click", async () => {
          try {
              await fetch("/api/v1/logout", { method: "POST" });
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

// ------------------------------------ Formulario SignIn

forms[0].addEventListener("submit", async (e) => {
  e.preventDefault();
  signInRES.textContent = "";
  signInRES.className = "";

  const btn = e.target.querySelector("button");
  const email = e.target.emailSignIn.value;
  const password = e.target.passwordSignIn.value;

  const errores = [];

  if (!email || !validarEmail(email)) {
    errores.push("· El email es incorrecto.");
  }

  if (!password || !validarPassword(password)) {
    errores.push("· La contraseña debe tener un mínimo de 6 caracteres.");
  }

  if (errores.length > 0) {
    signInRES.innerHTML = errores.join("<br/>");
    signInRES.className = "msg_error";
    return;
  }

  signInRES.textContent = "Enviando...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/v1/signin", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const resJSON = await res.json();

    if (resJSON.error) {
      signInRES.textContent = resJSON.error;
      signInRES.className = "msg_error";
    } else {
      signInRES.textContent = resJSON.message;
      signInRES.className = "msg_ok";

      setTimeout(() => {
        window.location.href = "/todos";
      }, 3000);
    }
  } catch (error) {
    signInRES.textContent = "Error de conexión con el servidor.";
    signInRES.className = "msg_error";
  } finally {
    btn.disabled = false;
  }
});

// ------------------------------------ Formulario SignUp

forms[1].addEventListener("submit", async (e) => {
  e.preventDefault();
  signUpRES.textContent = "";
  signUpRES.className = "";

  const btn = e.target.querySelector("button");
  const email = e.target.emailSignUp.value;
  const password = e.target.passwordSignUp.value;
  const passwordR = e.target.passwordSignUpR.value;

  const errores = [];

  if (!email || !password) {
    errores.push("· Debes rellenar todos los campos.");
  }

  if (email && !validarEmail(email)) {
    errores.push("· El email es incorrecto.");
  }

  if (password && !validarPassword(password)) {
    errores.push("· La contraseña debe tener un mínimo de 6 caracteres.");
  }

  if (password !== passwordR) {
    errores.push("· Las contraseñas no coinciden.");
  }

  if (errores.length > 0) {
    signUpRES.innerHTML = errores.join("<br/>");
    signUpRES.className = "msg_error";
    return;
  }

  signUpRES.textContent = "Enviando...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/v1/signup", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const resJSON = await res.json();

    if (resJSON.error) {
      signUpRES.textContent = resJSON.error;
      signUpRES.className = "msg_error";
    } else {
      signUpRES.textContent = resJSON.message;
      signUpRES.className = "msg_ok";
      setTimeout(() => {
        window.location.href = "/signin";          // Redirige a SignIn después de un breve mensaje de éxito. 
      }, 3000);
                  
    }
  } catch (error) {
    signUpRES.textContent = "Error de conexión con el servidor.";
    signUpRES.className = "msg_error";
  } finally {
    btn.disabled = false;
  }
});
