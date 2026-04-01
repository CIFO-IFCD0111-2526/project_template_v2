
document.addEventListener("DOMContentLoaded", async () => {

    const nav = document.getElementById("nav");

    if (!nav) return;

    try {
        const res = await fetch("/api/v1/me");

        if (res.ok) {
            nav.innerHTML = `
                <a href="/private">Private</a>
                <a href="/cuenta">Mi Cuenta</a>
                <button id="logoutBtn">Logout</button>
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

        const forms = document.querySelectorAll("form")
        const signInRES = document.querySelector("#signInRES")

        forms[0].addEventListener("submit", async e => {
            e.preventDefault();

            const UserSchema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required()
            });

            const email = e.target.email.emailSignIn.value
            const password = e.target.passwordSignIn.value

            const { error } = UserSchema.validate({ email, password })

            if (error) {
                signInRES.textContent = "Email inválido o password menor que 6 caracteres."
                return
            }

            try {
                const res = await fetch("/api/v1/signin", {
                    method: "post",
                    body: JSON.stringify({ email, password }),
                    headers: { "Content-Type": "application/json" }
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
                        window.location.href = "/private"
                    }, 3000);
                }

            } catch (error) {
                signInRES.textContent = "Error de conexion con el servidor";
            }
        })

        const signUpRES = document.querySelector("#signUpRES");

        // const privateLink = document.querySelectorAll("a");

        // registro
        forms[1].addEventListener("submit", async e => {
            e.preventDefault();

            // validación
            const UserSchema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
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
                const { error, value } = UserSchema.validate(datos, { abortEarly: false });
                if (error) {
                    console.log(error.details);
                    return;
                }
                // enviar datos a Back
                try {
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
                } catch (error) {
                    signUpRES.textContent = "Error de conexion con el servidor";
                }

            }
        })
    }
});