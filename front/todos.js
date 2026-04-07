
const tareasList = document.getElementById("tareasList");
const formNuevaTarea = document.getElementById("nuevaTarea");

// Cargar tareas al entrar (después de que main.js verifique sesión)
document.addEventListener("DOMContentLoaded", () => {
    if (tareasList) cargarTareas();
});

async function cargarTareas() {
    try {
        const res = await fetch("/api/v1/todos");
        if (!res.ok) return;
        const data = await res.json();
        const lista = Array.isArray(data) ? data : (data.tasks || []);
        renderizar(lista);
    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
}

function renderizar(lista) {
    if (!tareasList) return;
    tareasList.innerHTML = lista.length === 0 ? "<p class='mensaje-vacio'>No hay tareas.</p>" : "";

    lista.forEach(t => {
        const div = document.createElement("div");
        div.className = `tarea-item ${t.completada ? 'completada' : ''}`;
        div.innerHTML = `
            <div class="tarea-info">
                <input type="checkbox" class="check-toggle" data-id="${t.id}" ${t.completada ? 'checked' : ''}>
                <span>${t.titulo}</span>
            </div>
            <button class="btn-del" data-id="${t.id}">Eliminar</button>
        `;
        tareasList.appendChild(div);
    });
}

//  Eventos de creación
if (formNuevaTarea) {
    formNuevaTarea.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("tituloTarea");
        const titulo = input.value.trim();
        if (!titulo) return;

        await fetch("/api/v1/todos", {
            method: "POST",
            body: JSON.stringify({ titulo }),
            headers: { "Content-Type": "application/json" }
        });
        input.value = "";
        cargarTareas();
    });
}

// Borrar y Marcar
if (tareasList) {
    tareasList.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("btn-del")) {
            await fetch(`/api/v1/todos/${id}`, { method: "DELETE" });
            cargarTareas();
        }
        if (e.target.classList.contains("check-toggle")) {
            await fetch(`/api/v1/todos/${id}`, { method: "PUT" });
            cargarTareas();
        }
    });
}