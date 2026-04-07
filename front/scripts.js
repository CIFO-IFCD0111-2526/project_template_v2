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
                <a href="/signup">SignUp</a>
                <a href="/signin">SignIn</a>
            `;
    }
  } catch (error) {
    console.error("Error al verificar la sesión", error);
    nav.innerHTML = `
            <a href="/signup">SignUp</a>
            <a href="/signin">SignIn</a>
        `;
  }
});

// ------------------------------------------------------------------------------------

// ****************************************************************** Inicio bloque a eliminar
/* const UserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}); */
// ****************************************************************** Fin bloque a eliminar
// **************************************************** Inicio bloque a añadir
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarPassword(password) {
  return password.length >= 6;
}
// **************************************************** Fin bloque a añadir

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
// ***************************************************************************************bloque problemátco que usa Joi, a eliminar
    // Validación Joi
    // const { error } = UserSchema.validate(datos, { abortEarly: false });
    // //console.log(error.details);
    // if (error) {
    //   for (err of error.details) {
    //     if (err.path == "email") {
    //       signInRES.innerHTML += `· El email es incorrecto.<br/>`;
    //       //signInRES.innerHTML += `${err.message}<br/>`;
    //     } else {
    //       signInRES.innerHTML += `· La contraseña debe tener un mínimo de 6 carácteres.<br/>`;
    //     }
    //   }
    //   return;
    // }
// *************************************************************************************** Fin bloque problemático que usa Joi, a eliminar
// *************************************************************************************** Inicio bloque a añadir validación manual
    const email = e.target.emailSignIn.value;
    const password = e.target.passwordSignIn.value;

    const errores = [];

    if (!validarEmail(email)) {
      errores.push("· El email es incorrecto.");
    }

    if (!validarPassword(password)) {
      errores.push("· La contraseña debe tener un mínimo de 6 caracteres.");
    }

    if (errores.length > 0) {
      signInRES.innerHTML = errores.join("<br/>");
      return;
    }
// *************************************************************************************** Fin bloque añadido 
    try {
      const res = await fetch("/api/v1/signin", {
        method: "post",
        // body: JSON.stringify({ email, password }),                // Esta línea es ERRONEA, ya que el objeto que se envía al Back no tiene la estructura esperada (no se llama "emailSignIn" ni "passwordSignIn").
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
          window.location.href = "/private";
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
// *************************************************************************************** Inicio bloque a eliminar
    // // Validación con Joi
    // const { error, value } = UserSchema.validate(datos, { abortEarly: false });
    // if (error) {
    //   for (err of error.details) {
    //     if (err.path == "email") {
    //       signUpRES.innerHTML += `· El email es incorrecto<br/>`;
    //       //signInRES.innerHTML += `${err.message}<br/>`;
    //     } else {
    //       signUpRES.innerHTML += `· La contraseña debe tener un mínimo de 6 carácteres.<br/>`;
    //     }
    //   }
    //   return;
    // }
// *************************************************************************************** Fin bloque a eliminar
// ***************************************************************************************bloque añadido
    const email = e.target.emailSignUp.value;
    const password = e.target.passwordSignUp.value;
    const passwordR = e.target.passwordSignUpR.value;

    const errores = [];

    // Contraseñas iguales
    if (password !== passwordR) {
      errores.push("· Las contraseñas no coinciden.");
    }

    // Email válido
    if (!validarEmail(email)) {
      errores.push("· El email es incorrecto.");
    }

    // Password válida
    if (!validarPassword(password)) {
      errores.push("· La contraseña debe tener un mínimo de 6 caracteres.");
    }

    if (errores.length > 0) {
      signUpRES.innerHTML = errores.join("<br/>");
      return;
    }    
// ***************************************************************************************bloque añadido
// enviar datos a Back
    try {
      const res = await fetch("/api/v1/signup", {
        method: "post",
//        body: JSON.stringify({          // ERROR
//          email: value.email,           // ERROR
//          password: value.password,     // ERROR
//        }),                             // ERROR
          body: JSON.stringify({
            email,
            password
          }), // CORRECTO
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
