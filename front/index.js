
const forms = document.querySelectorAll("form");
const signInRES = document.querySelector("#signInRES");
const signUpRES = document.querySelector("#signUpRES");

// Identificar formularios por contenido de inputs
const loginForm = Array.from(forms).find(f => f.querySelector('[name*="SignIn"]') || f.emailSignIn);
const registerForm = Array.from(forms).find(f => f.querySelector('[name*="SignUp"]') || f.emailSignUp);

// ------------------------------------ LOGIN (SignIn)
if (loginForm && signInRES) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        signInRES.textContent = "";
        signInRES.className = "";

        const email = e.target.emailSignIn.value.trim();
        const password = e.target.passwordSignIn.value;

        // Validaciones usando las funciones de main.js
        if (!validarEmail(email) || !validarPassword(password)) {
            signInRES.textContent = "· Datos inválidos (Password mín. 6 caracteres)";
            signInRES.className = "msg_error";
            return;
        }

        try {
            const res = await fetch("/api/v1/signin", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (!res.ok) {
                signInRES.textContent = data.error;
                signInRES.className = "msg_error";
            } else {
                window.location.href = "/todos";
            }
        } catch (err) {
            signInRES.textContent = "Error de conexión";
        }
    });
}

// ------------------------------------ REGISTRO (SignUp)
if (registerForm && signUpRES) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        signUpRES.textContent = "";

        const email = e.target.emailSignUp.value.trim();
        const password = e.target.passwordSignUp.value;
        const passwordR = e.target.passwordSignUpR.value;

        if (password !== passwordR) {
            signUpRES.textContent = "· Las contraseñas no coinciden";
            signUpRES.className = "msg_error";
            return;
        }

        try {
            const res = await fetch("/api/v1/signup", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (!res.ok) {
                signUpRES.textContent = data.error;
                signUpRES.className = "msg_error";
            } else {
                signUpRES.className = "msg_ok";
                signUpRES.textContent = "¡Registro éxito! Redirigiendo...";
                setTimeout(() => window.location.href = "/", 2000);
            }
        } catch (err) {
            signUpRES.textContent = "Error de conexión";
        }
    });
}