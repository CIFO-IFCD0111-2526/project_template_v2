// TODO: Equipo Front JS - implementar logica aqui
// Ver issues en GitHub para las tareas asignadas
const forms = document.querySelectorAll("form");
const signUpRES = document.querySelector("#signUpRES");
// const privateLink = document.querySelectorAll("a");


// registro
forms[1].addEventListener("submit", async e => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/signup", {
        method: "post",
        body: JSON.stringify({ 
            email: e.target.emailSignUp.value,
            password: e.target.passwordSignUp.value
        }),
        headers: { "Content-Type": "application/json" },
    });
    const resJSON = await res.json();

    if (resJSON.error) signUpRES.textContent = resJSON.error;
    else signUpRES.textContent = resJSON.message;
});