const forms = document.querySelectorAll("form");
const signInRES = document.querySelector("#signInRES");

forms[0].addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const res = await fetch("/api/v1/signin", {
            method: "post",
            body: JSON.stringify({
                email: e.target.emailSignIn.value,
                password: e.target.passwordSignIn.value
            }),
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
        signInRES.textContent = "Error de connectión con el servidor.";
    }
});