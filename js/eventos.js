

const base_url = 'http://localhost:3000/eventos';

let calendarEl = document.getElementById('calendar');
let eliminar = document.getElementById('btnEliminar');
let myModal = new bootstrap.Modal(document.getElementById('myModal'));
let btnAccion = document.getElementById('btnAccion');
let frm = document.getElementById('formulario');
// btnAccion.addEventListener('click', agregarEvento);


obtenerEventos()
async function obtenerEventos() {
    const eventos = await fetch(base_url, {
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

async function agregarEvento() {
    // obtener id del jwt
    const token = localStorage.getItem('token');
    const id = convertirToken(token);
    // obtener el valor de los campos
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const lugar = document.getElementById('lugar').value;
    const fecha = document.getElementById('fecha').value;
    const horaInicio = document.getElementById('hora-inicio').value;
    const horaFin = document.getElementById('hora-fin').value;
    const responsable = document.getElementById('responsable').value;
    const background = document.getElementById('background').value;
    
    const horaInicioReemplazada = horaInicio.replace(':', '.');
    const horaFinReemplazada = horaFin.replace(':', '.');
    const horaInicioNumero = parseFloat(horaInicioReemplazada);
    const horaFinNumero = parseFloat(horaFinReemplazada);
    let duracionSuma = horaFinNumero - horaInicioNumero;
    duracionSuma = duracionSuma.toFixed(2);
    const duracion = duracionSuma.toString() + 'h';
    const datos = {
        nombre,
        descripcion,
        lugar,
        fecha,
        hora: horaInicio,
        duracion,
        responsable,
        background,
    }
    console.log(datos)
    const respuesta = await fetch(`${base_url}/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre,
            descripcion,
            lugar,
            fecha,
            hora: horaInicio,
            duracion,
            responsable,
            background,
            usuarioId: id
        })

    });
    const data = await respuesta.json();
    if (data.ok) {
        myModal.hide();
        calendar.refetchEvents();
        Swal.fire(
            'Aviso!',
            'Evento registrado correctamente',
            'success'
        )
    } 
    // al cerrar el modal, recargar la pagina
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
        // editable: true,
        // si da click en un evento abrir una nueva ventana
        eventClick: function (info) {
            // abrir una nueva ventana con el id del evento
            window.open(`evento.html?id=${info.event.id}`);
        },
        dateClick: function (info) {
            // el usuario no puede crear un evento en una fecha anterior a la actual
            const fechaActual = new Date();
            fechaActual.setHours(0, 0, 0, 0); // establecer hora, minuto, segundo y milisegundo en cero
            const fechaSeleccionada = new Date(info.dateStr);
            fechaSeleccionada.setHours(0, 0, 0, 0); // establecer hora, minuto, segundo y milisegundo en cero
            if (fechaSeleccionada < fechaActual) {
              Swal.fire(
                'Aviso!',
                'No puedes crear un evento en dias anteriores o en el mismo dia',
                'warning'
              )
              return;
        }
            frm.reset();
            eliminar.classList.add('d-none');
            document.getElementById('fecha').value = info.dateStr;
            document.getElementById('id').value = '';
            document.getElementById('btnAccion').textContent = 'Registrar';
            document.getElementById('titulo').textContent = 'Registrar Evento';
            myModal.show();
        },
    
    });
    calendar.render();
    frm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const title = document.getElementById('nombre').value;
        const start = document.getElementById('fecha').value;
        if (title == '' || start == '') {
            Swal.fire(
                'Aviso',
                'Todo los campos son obligatorios',
                'warning'
            )
        } else {
            await agregarEvento();
            window.location.reload();
        }
    });
})

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