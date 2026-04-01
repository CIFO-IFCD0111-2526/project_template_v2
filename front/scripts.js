const forms = document.querySelectorAll("form");
const signInRES = document.querySelector("#signInRES");

const UserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

forms[0].addEventListener("submit", async (e) => {
  // signInRES.textContent = "";
  e.preventDefault();
  
  const datos = {
    email: e.target.emailSignIn.value,
    password: e.target.passwordSignIn.value,
  };

  if (!e.target.emailSignIn.value || !e.target.passwordSignIn.value) {
    signInRES.textContent = "Los datos enviados están en formato incorrecto";
    return;
  } else {
    // Validación Joi
    const { error } = UserSchema.validate(datos, { email, password });
    console.log(error);
    if (error) {
      // signInRES.textContent = "Email inválido o password menor que 6 caracteres.";
      error.forEach((e) => {
        signInRES.textContent += e.message;
      });
      return;
    }

    try {
      const res = await fetch("/api/v1/signin", {
        method: "post",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const resJSON = await res.json();

      if (resJSON.error) {
        signInRES.textContent = resJSON.error;
      } else {
        signInRES.textContent = resJSON.message;

        if (resJSON.accessToken) {
          localStorage.setItem("accessToken", resJSON.accessToken);
        }

        setTimeout(() => {
          window.location.href = "/private";
        }, 3000);
      }
    } catch (error) {
      signInRES.textContent = "Error de connexión con el servidor.";
    }
  }
});

const signUpRES = document.querySelector("#signUpRES");

// const privateLink = document.querySelectorAll("a");

// registro
forms[1].addEventListener("submit", async (e) => {
  signUpRES.textContent = "";
  e.preventDefault();
  const datos = {
    email: e.target.emailSignUp.value,
    password: e.target.passwordSignUp.value,
  };

  if (!e.target.emailSignUp.value || !e.target.passwordSignUp.value) {
    signUpRES.textContent = "Los datos enviados están en formato incorrecto";
    return;
  } else {
    // Validamos que las contraseñas coinciden
    if (e.target.passwordSignUp.value !== e.target.passwordSignUpR.value) {
      signUpRES.textContent = "Las contraseñas no coinciden";
      return;
    }
    // Validación con Joi
    const { error, value } = UserSchema.validate(datos, { abortEarly: false });
    if (error) {
      console.log(error.details);
      signUpRES.textContent = error[0].details.message;
      return;
    }
    // enviar datos a Back
    try {
      const res = await fetch("/api/v1/signup", {
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
      signUpRES.textContent = "Error de conexión con el servidor";
    }
  }
});
