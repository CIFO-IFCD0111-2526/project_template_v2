const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {

const tareasList = document.querySelector("#tareasList");
const nuevaTarea = document.querySelector("#nuevaTarea");
const tituloTarea = document.querySelector("#tituloTarea");

// ------- -> LISTAR TAREAS <- -------

    try {
        const res = await fetch(`${API_URL}/api/v1/todos`);
        if (!res.ok) return;
        const data = await res.json();
        const tareas = Array.isArray(data) ? data : (data.tasks || []);

        tareas.forEach(tarea => {
            tareasList.innerHTML += `
                <div class="tarea${tarea.completada ? ' completada' : ''}">
                <input type="checkbox" class="check" data-id="${tarea.id}" ${tarea.completada ? "checked" : ""}>
                <span>${tarea.titulo}</span>
                <button data-id="${tarea.id}">Eliminar</button>
                </div>`;
        });

    } catch (error) {
        console.log(error);
    }

// ------- -> NUEVA TAREA <- -------

    nuevaTarea.addEventListener("submit", async (e) => {

    e.preventDefault();

    const titulo = e.target.tituloTarea.value;

    try {
        const res = await fetch(`${API_URL}/api/v1/todos`, {
            method: "post",
            body: JSON.stringify({ titulo }),
            headers: { "Content-Type": "application/json" },
        });

    const resJSON = await res.json();

    if (resJSON.error) {
        console.log(resJSON.error);
    } else {
        tareasList.innerHTML += `
            <div class="tarea">
            <input type="checkbox" class="check" data-id="${resJSON.task.id}">
            <span>${resJSON.task.titulo}</span>
            <button data-id="${resJSON.task.id}">Eliminar</button>
            </div>`
            tituloTarea.value = "";
    }

    } catch (error) {
        console.log(error);
    }

});

// ------- -> DELETAR TAREA <- -------

tareasList.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  // Toggle completada
  if (e.target.classList.contains("check")) {
    try {
        const res = await fetch(`${API_URL}/api/v1/todos/${id}`, {
            method: "PUT",
        });
        if (!res.ok) return;
        e.target.closest(".tarea").classList.toggle("completada");
    } catch (error) {
        console.log(error);
    }
    return;
  }

  // Eliminar
  if (e.target.tagName === "BUTTON") {
    try {
        const res = await fetch(`${API_URL}/api/v1/todos/${id}`, {
            method: "delete",
        });
        if (!res.ok) return;
        e.target.parentElement.remove();
    } catch (error) {
        console.log(error);
    }
  }
});

});
