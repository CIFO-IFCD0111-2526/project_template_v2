// ------------------------------------ Formulario SignIn
const API_URL = "http://localhost:3000";
const forms = document.querySelectorAll("form");
const signInRES = document.querySelector("#signInRES");
const signUpRES = document.querySelector("#signUpRES");

if (forms[0]) {
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
      const res = await fetch((`${API_URL}/api/v1/signin`), {
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
}

// ------------------------------------ Formulario SignUp

if (forms[1]) {
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
      const res = await fetch(`${API_URL}/api/v1/signup`, {
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
          window.location.href = "/";
        }, 3000);
      }
    } catch (error) {
      signUpRES.textContent = "Error de conexión con el servidor.";
      signUpRES.className = "msg_error";
    } finally {
      btn.disabled = false;
    }
  });
}
