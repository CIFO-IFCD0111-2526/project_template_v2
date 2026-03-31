// TODO: Equipo Front JS - implementar logica aqui
// Ver issues en GitHub para las tareas asignadas
const forms = document.querySelectorAll("form");
const signUpRES = document.querySelector("#signUpRES");

// registro
forms[1].addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        email: e.target.emailSignUp.value.trim(),
        password: e.target.passwordSignUp.value,
    };

    if (!datos.email || !datos.password) {
        signUpRES.textContent = "Los datos enviados están en formato incorrecto";
        return;
    } 

    // Enviar datos a Back
    try{
        const res = await fetch("/api/v1/signup", {
            method: "POST",
            body: JSON.stringify(datos),
            headers: { "Content-Type": "application/json" },
        });

         // Verificar status HTTP
        if (!res.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const resJSON = await res.json();

        if (resJSON.error) {
            signUpRES.textContent = resJSON.error;
        } else {
            signUpRES.textContent = resJSON.message;
        }
    } catch(error){
        signUpRES.textContent="Error de conexión con el servidor";
    }
});