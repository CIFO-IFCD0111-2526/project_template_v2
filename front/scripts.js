const forms = document.querySelectorAll("form");
const signInRES = document.querySelector("#signInRES");
const signUpRES = document.querySelector("#signUpRES");

// ------------------------------------   Pendiente probar NAV
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

      // const logoutBtn = document.getElementById("logoutBtn");

      // logoutBtn.addEventListener("click", async () => {
      //     try {
      //         await fetch("/api/v1/logout", { method: "POST" });
      //         localStorage.removeItem("accessToken");
      //         window.location.href = "/";
      //     } catch (error) {
      //         console.error("Error al hacer logout", error);
      //     }
      // });
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

// ------------------------------------------------------------------------------------


const UserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

forms[0].addEventListener("submit", async (e) => {
  signInRES.textContent = "";
  signUpRES.textContent = "";
  e.preventDefault();

  const datos = {
    email: e.target.emailSignIn.value,
    password: e.target.passwordSignIn.value,
  };

  if (!e.target.emailSignIn.value || !e.target.passwordSignIn.value) {
    signInRES.innerHTML = "· Debes rellenar los campos<br/>";
    return;
  } else {
    // Validación Joi
    const { error } = UserSchema.validate(datos, { abortEarly: false });
    //console.log(error.details);
    if (error) {
      for (err of error.details) {
        if (err.path == "email") {
          signInRES.innerHTML += `· El email es incorrecto.<br/>`;
          //signInRES.innerHTML += `${err.message}<br/>`;
        } else {
          signInRES.innerHTML += `· La contraseña debe tener un mínimo de 6 carácteres.<br/>`;
        }
      }
      return;
    }

    try {
      const res = await fetch("/", {
        method: "post",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const resJSON = await res.json();

      if (resJSON.error) {
        signInRES.textContent = resJSON.error;
      } else {
        signInRES.textContent = resJSON.message;

        // Comentamos el almacenamiento del token en localStorage al no ser necesario en el formulario web de login (se guarda en las Cookies).
        /*
        if (resJSON.accessToken) {
          localStorage.setItem("accessToken", resJSON.accessToken);
        } */

        setTimeout(() => {
          window.location.href = "/todos";
        }, 3000);
      }
    } catch (error) {
      signInRES.textContent = "· Error de connexión con el servidor.";
    }
  }
});

// registro
forms[1].addEventListener("submit", async (e) => {
  signInRES.textContent = "";
  signUpRES.textContent = "";
  e.preventDefault();
  const datos = {
    email: e.target.emailSignUp.value,
    password: e.target.passwordSignUp.value,
  };

  if (!e.target.emailSignUp.value || !e.target.passwordSignUp.value) {
    signUpRES.innerHTML = "· Debes rellenar los campos<br/>";
    return;
  } else {
    // Validamos que las contraseñas coinciden
    if (e.target.passwordSignUp.value !== e.target.passwordSignUpR.value) {
      signUpRES.innerHTML += "· Las contraseñas no coinciden.<br/>";
      //return;
    }
    // Validación con Joi
    const { error, value } = UserSchema.validate(datos, { abortEarly: false });
    if (error) {
      for (err of error.details) {
        if (err.path == "email") {
          signUpRES.innerHTML += `· El email es incorrecto<br/>`;
          //signInRES.innerHTML += `${err.message}<br/>`;
        } else {
          signUpRES.innerHTML += `· La contraseña debe tener un mínimo de 6 carácteres.<br/>`;
        }
      }
      return;
    }
    // enviar datos a Back
    try {
      const res = await fetch("/", {
        method: "post",
        body: JSON.stringify({
          email: value.email,
          password: value.password,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const resJSON = await res.json();

      if (resJSON.error) {
        signUpRES.textContent = resJSON.error;
      } else {
        signUpRES.textContent = resJSON.message;
      }
    } catch (error) {
      signUpRES.textContent = "· Error de conexión con el servidor";
    }
  }
});
