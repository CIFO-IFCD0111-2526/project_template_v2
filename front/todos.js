/*============================================================
=                 Gestió js de les tasques                   =
============================================================*/
// Cal carregar al todos.html: <script src="./js/todos.js" defer></script>  o la ruta que sigui.

const lista = document.getElementById("tareasList");

// GET — Obtenir totes les tasques
async function cargarTareas() {
    const res = await fetch("/api/v1/todos", {
        credentials: "include"
    });

    const tareas = await res.json();
    renderTareas(tareas);
}

// POST — Crear una nova tasca
function renderTareas(tareas) {
    lista.innerHTML = "";

    tareas.forEach(t => {
        const div = document.createElement("div");
        div.classList.add("tarea");
        if (t.completada) div.classList.add("completada");

        div.innerHTML = `
            <input type="checkbox" class="check" ${t.completada ? "checked" : ""}>
            <span>${t.titulo}</span>
        `;

        div.querySelector(".check").addEventListener("change", async () => {
            await fetch(`/api/v1/todos/${t.id}`, {
                method: "PUT",
                credentials: "include"
            });

            div.classList.toggle("completada");
        });

        lista.appendChild(div);
    });
}

cargarTareas();



