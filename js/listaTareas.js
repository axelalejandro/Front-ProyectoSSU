
const agregar = document.querySelector('#agregar-tarea');
const resultado = document.querySelector('.resultado');

agregar.addEventListener('click', agregarTarea);

async function agregarTarea(e) {
    e.preventDefault();
    const nombre = document.getElementById('descripcion').value;
    const hora = document.getElementById('hora').value;
    const fecha = document.getElementById('fecha').value;
    const data = { nombre, hora, fecha };
    const url = 'http://localhost:3000/tareas';
    const resultado = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if (respuesta.ok === 'errores') {
        limpiarHTML();
        mostrarErrores(respuesta.errors);
    }
    if(respuesta.ok === false){
        limpiarHTML();
        mostrarError(respuesta);
    }
    if(respuesta.ok === true){
        limpiarHTML();
        obtenerTareas();
    }
}

obtenerTareas();
async function obtenerTareas() {
    const divTarea = document.querySelector('.item-tarea');
    const descripcion = document.querySelector('.mostrar-descripcion');
    const hora = document.querySelector('.mostrar-hora');
    const fecha = document.querySelector('.mostrar-fecha');
    const btnEliminar = document.querySelector('.eliminar');
    const btnCompletada = document.querySelector('.completada');
    const url = 'http://localhost:3000/tareas';
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    console.log(respuesta);
    if(respuesta.ok === false){
        btnEliminar.style.display = 'none';
        btnCompletada.style.display = 'none';
        divTarea.textContent = respuesta.msg;
    }
    if(respuesta.ok === true){
        mostrarTareas(respuesta.tareas);
    }
}

function mostrarTareas(tareas) {
    limpiarHTML();
    const divTarea = document.querySelector('.item-tarea');
    const totalTareas = document.querySelector('#total');
    const completadas = document.querySelector('#completadas');
    const pendientes = document.querySelector('#pendientes');
    completadas.textContent = `Completadas: ${tareas.filter(tarea => tarea.estado === false).length}`;
    totalTareas.textContent = `Total: ${tareas.length}`;
    pendientes.textContent = `Pendientes: ${tareas.filter(tarea => tarea.estado === true).length}`;
    tareas.forEach((tarea, i) => {
        // agregar todas las tareas en divTarea
        divTarea.innerHTML += ` 
        <div class="item-tarea container justify-content-between align-items-center">
            <div class="mostrar-descripcion">
                <p>${tarea.nombre}</p>
            </div>
            <div class="mostrar-hora">
                <p>${tarea.hora}</p>
            </div>
            <div class="mostrar-fecha">
                <p>${tarea.fecha}</p>
            </div>
           <div>
           <button class="btn btn-primary" onclick="completarTarea(${tarea.id})">Editar</button>
           <button class="btn btn-success" onclick="completarTarea(${tarea.id})">Completada</button>
           <button class="btn btn-danger" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
            </div>
        </div>
        `
    });
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarErrores(errors) {
  
    errors.forEach((error) => {
        const alerta = document.createElement('small');
        alerta.textContent = error.msg;
        alerta.classList.add('text-danger');
        resultado.appendChild(alerta);
        const br = document.createElement('br');
        resultado.appendChild(br);
    });

}

function mostrarError(error) {
    const alerta = document.createElement('small');
    alerta.textContent = error.msg;
    alerta.classList.add('text-danger');
    resultado.appendChild(alerta);
}