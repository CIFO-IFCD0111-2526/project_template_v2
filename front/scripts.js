const forms = document.querySelectorAll("form");
const signInRES = document.querySelector("#signInRES");
const signUpRES = document.querySelector("#signUpRES");
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
// ------------------------------------ Página Mi Cuenta

document.addEventListener("DOMContentLoaded", async () => {

  const userEmail = document.querySelector("#userEmail");

  if (!userEmail) return;

  try {

    const res = await fetch("/api/v1/me", {
      credentials: "include"
    });

    if (!res.ok) {
      window.location.href = "/";
      return;
    }

    const resJSON = await res.json();

    document.querySelector("#userEmail").textContent = resJSON.email;
    document.querySelector("#userId").textContent = resJSON.id;

    const fecha = new Date(resJSON.createdAt);

    document.querySelector("#userCreatedAt").textContent =
      fecha.toLocaleString("es-ES");

  } catch (error) {

    console.error("Error cargando datos usuario", error);

    window.location.href = "/";

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

  const UserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = UserSchema.validate({ email, password });

  if (error) {
    signInRES.textContent = "Email inválido o password menor que 6 caracteres.";
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

      if (resJSON.accessToken) {
        localStorage.setItem("accessToken", resJSON.accessToken);
      }

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

  const UserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  if (!email || !password) {
    signUpRES.textContent = "Los datos enviados están en formato incorrecto.";
    signUpRES.className = "msg_error";
    return;
  }

  if (password !== passwordR) {
    signUpRES.innerHTML = "· Las contraseñas no coinciden.";
    signUpRES.className = "msg_error";
    return;
  }

  const { error, value } = UserSchema.validate({ email, password }, { abortEarly: false });
  if (error) {
    signUpRES.innerHTML = error.details
      .map((err) => {
        if (err.path[0] === "email") return "· El email es incorrecto";
        return "· La contraseña debe tener un mínimo de 6 caracteres.";
      })
      .join("<br/>");
    signUpRES.className = "msg_error";
    return;
  }

  signUpRES.textContent = "Enviando...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/v1/signup", {
      method: "post",
      body: JSON.stringify({ email: value.email, password: value.password }),
      headers: { "Content-Type": "application/json" },
    });

    const resJSON = await res.json();

    if (resJSON.error) {
      signUpRES.textContent = resJSON.error;
      signUpRES.className = "msg_error";
    } else {
      signUpRES.textContent = resJSON.message;
      signUpRES.className = "msg_ok";
    }
  } catch (error) {
    signUpRES.textContent = "Error de conexión con el servidor.";
    signUpRES.className = "msg_error";
  } finally {
    btn.disabled = false;
  }
});
