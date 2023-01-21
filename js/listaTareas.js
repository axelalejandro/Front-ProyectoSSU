
const agregar = document.querySelector('#agregar-tarea');
const resultado = document.querySelector('.resultado');

agregar.addEventListener('click', agregarTarea);

async function agregarTarea(e) {
    e.preventDefault();
    const nombre = document.getElementById('descripcion').value;
    const hora = document.getElementById('hora').value;
    const fecha = document.getElementById('fecha').value;
    const data = { nombre, hora, fecha };
    const token = localStorage.getItem('token');
    const id = convertirToken(token);
    const url = `http://localhost:3000/tareas/${id}`;
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
        return
    }
    if(respuesta.ok === false){
        limpiarHTML();
        mostrarError(respuesta);
        return
    }
    obtenerTareas();
}

obtenerTareas();
async function obtenerTareas() {
    // 
    const divTarea = document.querySelector('.item-tarea');
    divTarea.innerHTML = '';
    const btnEliminar = document.querySelector('.eliminar');
    const btnCompletada = document.querySelector('.completada');
    // obtener el jwt del localstorage
    const token = localStorage.getItem('token');
    const id = convertirToken(token);
    console.log(id)
    const url = `http://localhost:3000/tareas/${id}`;
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    console.log(respuesta)
    if(respuesta.ok === false){
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
                <p class="${tarea.estado === false ? 'completada' : ''}">${tarea.nombre}</p>
            </div>
            <div class="mostrar-hora">
            <p class="${tarea.estado === false ? 'completada' : ''}">${tarea.hora}</p>
            </div>
            <div class="mostrar-fecha">
            <p class="${tarea.estado === false ? 'completada' : ''}">${tarea.fecha}</p>
            </div>
           <div>
           <button class="btn btn-primary" onclick="editarTarea(${tarea.id})">Editar</button>
            <button class="btn ${tarea.estado === true ? 'btn-success' : 'btn-warning'}" onclick="completarTarea(${tarea.id})">${tarea.estado === true ? 'Completada' : 'Pendiente'}</button>    
           <button class="btn btn-danger" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
            </div>
        </div>
        `
    });
}

async function editarTarea(id) {

}
async function eliminarTarea(id)  {
    const url = `http://localhost:3000/tareas/${id}`;
    const resultado = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if(respuesta.ok === false){
        limpiarHTML();
        mostrarError(respuesta);
    }
    obtenerTareas();
}
async function completarTarea(id) {
    const url = `http://localhost:3000/tareas/completar/${id}`;
    const resultado = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if(respuesta.ok === false){
        limpiarHTML();
        console.log(respuesta);
    }

    obtenerTareas();
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

function convertirToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const obj = JSON.parse(jsonPayload);
    id = obj.id;
    return id;
}