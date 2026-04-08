/*============================================================
=                 Gestió js de les tasques                   =
============================================================*/


const lista = document.getElementById("tareasList");

// GET — Obtenir totes les tasques
async function cargarTareas() {
    const res = await fetch("/api/v1/todos", {
        credentials: "include"
    });

    // Si la resposta no és OK, mostrar un error
    if (!res.ok) {
        console.error("Error cargando tareas:", res.status);
        lista.innerHTML = "<p>Error cargando tareas</p>";
        return;
    }

    const data = await res.json();
    const tareas = Array.isArray(data) ? data : (data.tasks || []);
    renderTareas(tareas);
}

// Renderizar tareas + PUT toggle completada
function renderTareas(tareas) {
    lista.innerHTML = "";

    // Si no hi ha tasques, mostrar un missatge
    if (!tareas || tareas.length === 0) {
        lista.innerHTML = "<p>No hay tareas pendientes</p>";
        return;
    }
    tareas.forEach(t => {
        const div = document.createElement("div");
        div.classList.add("tarea");
        if (t.completada) div.classList.add("completada");

        div.innerHTML = `
            <input type="checkbox" class="check" ${t.completada ? "checked" : ""}>
            <span>${t.titulo}</span>
        `;

        div.querySelector(".check").addEventListener("change", async () => {
            const res = await fetch(`/api/v1/todos/${t.id}`, {
                method: "PUT",
                credentials: "include"
            });
            // Si la resposta no és OK, mostrar un error i no canviar l'estat visual de la tasca
            if (!res.ok) {
                console.error("Error actualizando tareas:", res.status);
                return;
            }

            div.classList.toggle("completada");
        });

        lista.appendChild(div);
    });
}

if (lista) cargarTareas();
