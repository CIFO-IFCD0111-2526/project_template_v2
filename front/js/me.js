// ------------------------------------ Página Mi Cuenta

document.addEventListener("DOMContentLoaded", async () => {

  const userEmail = document.querySelector("#userEmail");

  if (!userEmail) return;

  try {

    const res = await fetch("/api/v1/me", {
      credentials: "include"
    });

    if (!res.ok) {
      window.location.href = "/";
      return;
    }

    const resJSON = await res.json();

    document.querySelector("#userEmail").textContent = resJSON.email;
    document.querySelector("#userId").textContent = resJSON.id;

    const fecha = new Date(resJSON.createdAt);

    document.querySelector("#userCreatedAt").textContent =
      fecha.toLocaleString("es-ES");

  } catch (error) {

    console.error("Error cargando datos usuario", error);

    window.location.href = "/";

  }

});
