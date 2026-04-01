const forms = document.querySelectorAll("form")
const signInRES = document.querySelector("signInRES")

const UserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

forms[0].addEventListener("submit", async e => {
    e.preventDefault();
    const email = e.target.email.emailSignIn.value
    const password = e.target.passwordSignIn.value

    const { error } = UserSchema.validate({ email, password })

    if (error) {
        signInRES.textContent = "Email inválido ou password menor que 6 caracteres."
        return
    }

    try {
        const res = await fetch("/api/v1/signin", {
            method: "post",
            body: JSON.stringify({email, password}),
            headers: {"Content-Type": "application/json"}
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
        signInRES.textContent = "Error de connectión con el servidor."
    }
})