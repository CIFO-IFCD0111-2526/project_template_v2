
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
                    console.error("Erro ao fazer logout", error);
                }
            });

        } else {
            nav.innerHTML = `
                <a href="/signup">SignUp</a>
                <a href="/signin">SignIn</a>
            `;
        }
    } catch (error) {
        console.error("Erro ao verificar sessão", error);
        nav.innerHTML = `
            <a href="/signup">SignUp</a>
            <a href="/signin">SignIn</a>
        `;
    }
});