
document.addEventListener("DOMContentLoaded", async () => {
    const messageContainer = document.getElementById("privateMessage");
    if (!messageContainer) return;

    try {
        const res = await fetch("/api/v1/me");
        if (res.ok) {
            const data = await res.json();
            messageContainer.innerHTML = `
                <h2>Mi Perfil</h2>
                <div class="card">
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Estado:</strong> Usuario Autenticado</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error al cargar datos de perfil:", error);
    }
});