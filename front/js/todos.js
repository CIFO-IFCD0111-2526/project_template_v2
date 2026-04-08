
document.addEventListener("DOMContentLoaded", async () => {

const tareasList = document.querySelector("#tareasList");
const nuevaTarea = document.querySelector("#nuevaTarea");
const tituloTarea = document.querySelector("#tituloTarea");

// ------- -> LISTAR TAREAS <- -------

    try {
        const res = await fetch("/api/v1/todos");
        const resJSON = await res.json();

        resJSON.forEach(tarea => {
            tareasList.innerHTML += `
                <div class="tarea">
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
        const res = await fetch("/api/v1/todos", {
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
  if (e.target.dataset.id) {
    try {
        const res = await fetch(`/api/v1/todos/${e.target.dataset.id}`, {
            method: "delete",
        });

    const resJSON = await res.json();

    e.target.parentElement.remove();

    } catch (error) {
        console.log(error);
    }
  }
});

});
