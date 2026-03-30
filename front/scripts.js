// TODO: Equipo Front JS - implementar logica aqui
// Ver issues en GitHub para las tareas asignadas
const forms = document.querySelectorAll("form");
const signUpRES = document.querySelector("#signUpRES");
const joi = require("joi");

// const privateLink = document.querySelectorAll("a");


// registro
forms[1].addEventListener("submit", async e => {
    e.preventDefault();

    // validación
    const UserSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    });

    const datos = {
        email: e.target.emailSignUp.value,
        password: e.target.passwordSignUp.value,
    }

    if (!e.target.emailSignUp.value || !e.target.passwordSignUp.value) {
        signUpRES.textContent = "Los datos enviados están en formato incorrecto";
        return;
    } else {
    // Validación con Joi
    const { error, value } = UserSchema.validate(datos, {abortEarly: false});
    if (error) {
        console.log(error.details);
        return;
    }
    // enviar datos a Back
    try{
    const res = await fetch("/api/v1/signup", {
        method: "post",
        body: JSON.stringify({ 
            email: value.email,
            password: value.password
        }),
        headers: { "Content-Type": "application/json" },
    });
    const resJSON = await res.json();

    if (resJSON.error) {
        signUpRES.textContent = resJSON.error;
    } else {
        signUpRES.textContent = resJSON.message;
    }
} catch(error){
    signUpRES.textContent="Error de conexion con el servidor";
}
}
});
