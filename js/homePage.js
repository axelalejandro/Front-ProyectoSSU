function cerrarSesion() {
    localStorage.removeItem('token');
    window.location.href = 'http://127.0.0.1:5500/HTML/logginProyectista.html';
}

const proyectosContainer = document.querySelector('.proyectos-container');
let calendarEl = document.getElementById('calendar');
let eliminar = document.getElementById('btnEliminar');
let myModal = new bootstrap.Modal(document.getElementById('myModal'));
let btnAccion = document.getElementById('btnAccion');
let frm = document.getElementById('formulario');

obtenerProyectosRecientes();
async function obtenerProyectosRecientes() {
    const url = 'http://localhost:3000/proyectos/recientes';
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    console.log(respuesta);
    if(respuesta.ok == false) {
        while(proyectosContainer.firstChild) {
            proyectosContainer.removeChild(proyectosContainer.firstChild);
        }
        const mensaje = document.createElement('p');
        mensaje.textContent = respuesta.msg;
        mensaje.classList.add('text-white', 'text-center', 'font-weight-bold', 'm-auto', 'fs-3');
        proyectosContainer.appendChild(mensaje);
        return;
    }
    if(respuesta.ok == true) {
        mostrarProyectos(respuesta.proyectos);
    }
}

function mostrarProyectos(proyectos) {
    proyectos.forEach(proyecto => {
        proyectosContainer.innerHTML += `
        <div class="proyectos-card">
            <div class="proyectos-card-info p-3">
                <h5 class="titulos-proyectos">${proyecto.nombre}</h5>
                <p class="descripcion-proyectos"><strong>Descripcion:</strong> <br>
                ${proyecto.descripcion}</p>
                <button class="button">Ver Mas!</button>
            </div>
        </div>
        `
    });
}

obtenerEventos()
async function obtenerEventos() {
    const eventos = await fetch('http://localhost:3000/eventos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await eventos.json();
    return data.eventos.map(evento => ({
        id: evento.id,
        title: evento.nombre,
        start: evento.fecha,
        backgroundColor: evento.background,
    }));
}


document.addEventListener('DOMContentLoaded', async function () {
    const eventos = await obtenerEventos();
    calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'local',
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev next today',
            center: 'title',
            right: 'dayGridMonth timeGridWeek listWeek'
        },
          
        events: eventos,
        eventClick: function (info) {
            window.open(`evento.html?id=${info.event.id}`);
        }     
    });
    calendar.render();
})