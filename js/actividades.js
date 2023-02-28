const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const URL_BASE = 'http://localhost:3000/actividades';
const divActividad = document.querySelector('.actividad-section');
const divMensaje = document.querySelector('.resultado');

obtenerActividad(id);
async function obtenerActividad(id) {
    console.log(id);
    const response = await fetch(`http://localhost:3000/actividades/obtener-actividad/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const actividad = await response.json();
    if(actividad.ok == false) {
        const mensaje = document.createElement('p');
        mensaje.textContent = actividad.msg;
        divMensaje.appendChild(mensaje);
        return
    }
    mostrarActividad(actividad.actividad);
}

function mostrarActividad(actividad) {
    const { nombre, nombreMiembro, descripcion, createdAt, fecha, estado, sede } = actividad;
    divActividad.innerHTML = `
    <div class="actividad-button-regresar pb-2">
        <a href="formularioProyectos.html"><button class="btn btn-primary">Regresar</button></a>
    </div>
    <div class="actividad-titulo d-flex align-items-center"> 
        <h2>${(nombre).toUpperCase()}</h2>
        <small class="rounded ${estado == 0 ? 'warning' : 'success'}">${estado == 0 ? 'Incompleto' : 'Completo'}</small>
    </div>
    <div class="actividad-container">
        <p><strong>Creada por:</strong><br> ${nombreMiembro}</p>
        <p><strong>Descripcion de la actividad:</strong><br>${descripcion}</p>
        <div class="actividad-fechas">
            <p><strong>Fecha de inicio:</strong> ${new Date(createdAt).toLocaleDateString()}</p>
            <p><strong>Fecha de fin:</strong> ${new Date(fecha).toLocaleDateString()}</p>
        </div>
        <p><strong>SEDE:</strong> ${sede}</p>
    </div>
    <div class="actividad-buttons">
        <button class="btn btn-success" onclick="marcarCompleta(${actividad.id})">Marcar completa</button>
        <button class="btn btn-warning">Editar</button>
        <button class="btn btn-danger">Eliminar</button>
    </div>

    `
}

