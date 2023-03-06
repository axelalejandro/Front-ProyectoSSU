const misProyectos = document.querySelector('.mis-proyectos-li');
const agregarProyecto = document.querySelector('.agregar-proyectos');
const proyectosValidados = document.querySelector('.proyectos-validados');
const noValidados = document.querySelector('.no-validados');
const divProyectos = document.querySelector('.mis-proyectos');
const formulario = document.querySelector('.formulario');
const agregarProyectoBtn = document.querySelector('.agregar-proyecto');
const resultado = document.querySelector('.resultado');
const divRespuesta = document.querySelector('.resultado-proyectos');
const divProyecto = document.querySelector('.proyecto');
const divActividades = document.querySelector('.actividades');
const resultadoActividades = document.querySelector('.resultado-actividades');

misProyectos.addEventListener('click', () => {
    window.location.reload();
});
agregarProyecto.addEventListener('click', mostrarFormulario);
agregarProyectoBtn.addEventListener('click', agregarProyectos);
proyectosValidados.addEventListener('click', mostrarProyectosValidados);
noValidados.addEventListener('click', mostrarProyectosNoValidados);

async function agregarProyectos(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const usuarioId = convertirToken(token).id;
    const IDproyectista = convertirToken(token).AIMID;
    const url = `http://localhost:3000/proyectos/${usuarioId}`;
    const nombre = document.querySelector('#nombre').value;
    const descripcion = document.querySelector('#descripcion').value;
    const personal = document.querySelector('#personal').value;
    const responsable = document.querySelector('#responsable').value;
    const data = {
        nombre,
        IDproyectista,
        descripcion,
        personal,
        responsable,
        usuarioId,
    }
    const resultado = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    });
    const respuesta = await resultado.json();
    if (respuesta.ok === 'errores') {
        limpiarHTML();
        mostrarErrores(respuesta.errors);
        return
    }
    if (respuesta.ok === false) {
        limpiarHTML();
        mostrarError(respuesta);
        return
    }
    if (respuesta.ok === true) {
        limpiarHTML();
        alert('Proyecto agregado correctamente');
        // recargar la pagina
        window.location.reload();
    }
}

async function mostrarFormulario() {
    formulario.classList.remove('d-none');
    divProyectos.classList.add('d-none');
}


mostrarProyectos();
async function mostrarProyectos() {
    divProyectos.classList.remove('d-none');
    formulario.classList.add('d-none');
    const token = localStorage.getItem('token');
    const id = convertirToken(token).id;
    const urlProyectos = `http://localhost:3000/proyectos/${id}}`
    
    const resultadoProyectos = await fetch(urlProyectos, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuestaProyectos = await resultadoProyectos.json();
    if(respuestaProyectos.ok === false){
        while(divRespuesta.firstChild) {
            divRespuesta.removeChild(divRespuesta.firstChild);
        }
        const mensaje = document.createElement('p');
        mensaje.textContent = respuestaProyectos.msg;
        mensaje.classList.add('text-danger');
        divRespuesta.appendChild(mensaje);
        divProyecto.classList.add('d-none');

        return;
    }
    
    // llamar la funcion del porcentaje para cada proyecto
    const porcentaje = obtenerPorcentaje(respuestaProyectos.proyectos);
    mostrarProyectosHTML(respuestaProyectos.proyectos, porcentaje);
    
}

function obtenerPorcentaje(proyectos) {
    let porcentajes = [];
    proyectos.forEach((proyecto, i) => {
       if(proyecto.actividades.length === 0) {
           porcentajes.push(0);
           return;
       }
        let actividadesTotales = proyecto.actividades.length;
        let actividadesCompletadas = proyecto.actividades.filter(actividad => actividad.estado === true);
        let actividadesCompletadasTotales = actividadesCompletadas.length;
        const porcentaje = (actividadesCompletadasTotales / actividadesTotales) * 100;
        porcentajes.push(Math.round(porcentaje));
    });
    return porcentajes;
}

async function mostrarProyectosValidados() {
    while(divRespuesta.firstChild) {
        divRespuesta.removeChild(divRespuesta.firstChild);
    }
    console.log('validados');
    divProyectos.classList.remove('d-none');
    formulario.classList.add('d-none');
    const token = localStorage.getItem('token');
    const id = convertirToken(token).id;
    const url = `http://localhost:3000/proyectos/${id}}?validado=true`
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if(respuesta.ok === false){
        while(divRespuesta.firstChild) {
            divRespuesta.removeChild(divRespuesta.firstChild);
        }
        const mensaje = document.createElement('p');
        mensaje.textContent = respuesta.msg;
        mensaje.classList.add('text-danger');
        divRespuesta.appendChild(mensaje);
        divProyecto.classList.add('d-none');

        return;
    }
    if(respuesta.ok === "validado") {
        const porcentaje = obtenerPorcentaje(respuesta.proyectos);
        mostrarProyectosHTML(respuesta.proyectos, porcentaje);
        return
    }
}

async function mostrarProyectosNoValidados() {
    while(divRespuesta.firstChild) {
        divRespuesta.removeChild(divRespuesta.firstChild);
    }
    console.log('no validados');
    divProyectos.classList.remove('d-none');
    formulario.classList.add('d-none');
    const token = localStorage.getItem('token');
    const id = convertirToken(token).id;
    const url = `http://localhost:3000/proyectos/${id}}?validado=false`
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if(respuesta.ok === false){
        while(divRespuesta.firstChild) {
            divRespuesta.removeChild(divRespuesta.firstChild);
        }
        const mensaje = document.createElement('p');
        mensaje.textContent = respuesta.msg;
        mensaje.classList.add('text-danger');
        divRespuesta.appendChild(mensaje);
        divProyecto.classList.add('d-none');
        return;
    }
    if(respuesta.ok === "noValidado") {
        divProyecto.classList.remove('d-none');
        const porcentaje = obtenerPorcentaje(respuesta.proyectos);
        mostrarProyectosHTML(respuesta.proyectos, porcentaje);
        return
    }
}


function mostrarProyectosHTML(proyectos, porcentajes) {
    limpiarHTML();
    while(divProyecto.firstChild) {
        divProyecto.removeChild(divProyecto.firstChild);
    }
    proyectos.forEach((proyecto, index) => {
        const porcentaje = porcentajes[index];
        const actividades = proyecto.actividades;
        
        divProyecto.innerHTML += `
        <div class="proyecto-container "> 
            <div class="d-flex justify-content-between align-items-center m-2"> 
                <h4 class="titulo-proyectos" >${proyecto.nombre} </h4> 
                <small class="${proyecto.estado == 0 ? 'no-validado' : 'validado'}">${proyecto.estado == 0 ? 'No Validado' : 'Validado'}</small>
            </div>
            <div>
                <div> 
                <p><strong>Descripción:</strong><br> ${proyecto.descripcion}</p>
                <p><strong>Personal:</strong><br> ${proyecto.personal}</p>
                <p><strong>Actividades:</strong><br></p>
                <div class=" w-100 d-flex justify-content-between align-items-center">
                ${proyecto.actividades.length > 0 ? `
                <ul class="lista d-flex flex-column">
                    ${actividades.map(actividad => `<div class="d-flex align-items-center justify-content-start"><a href="actividades.html?id=${actividad.id}" class="btn mb-2 ${proyecto.estado == 0 ? 'disabled-btn' : 'enable'} ${actividad.estado == 0 ? 'btn-warning' : 'btn-success btn-completo' }">${actividad.nombre}</a><small>${actividad.estado == 0 ? '❌' : '✅'}</small></div>`).join('')}
                </ul>
                ` : `
                <p>No hay actividades</p>
                `}
                <button class="btn btn-secundary" id="openModalBtn" data-id-proyecto="${proyecto.id}")>Agregar actividad </button>
                </div>
                <p><strong>Responsable:</strong><br> ${proyecto.responsable}</p>
                </div>
            </div>
            <div class="progress">
                <div class="${porcentaje <= 0 ? 'text-dark': 'text-light'} progress-bar" role="progressbar" style="width: ${porcentaje}%; animation: progress-bar-fill ${porcentaje / 2}s linear reverse;" aria-valuenow="${porcentaje}" aria-valuemin="0" aria-valuemax="100">${porcentaje}%</div>
            </div>
            <style>
                .progress-bar-fill {
                    width: ${porcentaje}%;
                }
                
                @keyframes progress-bar-fill {
                    to {
                        width: 0%;
                    }
                }
            </style>
            <div class="d-flex justify-content-center align-items-center m-2">
                <button class="btn btn-primary m-2">Editar</button>
                <button class="btn btn-danger">Eliminar</button>
            </div>
        </div>
        `;
        // Obtener referencia al botón para abrir el modal
        const openModalBtn = document.querySelectorAll('#openModalBtn');
    
        // Obtener referencia al modal
        const modalEl = document.getElementById('exampleModal');
      
        // Crear un objeto Modal a partir del elemento modal
        const modal = new bootstrap.Modal(modalEl);
      
        openModalBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                // Obtener el id del proyecto con el dataset del botón data-id-proyecto
                const id = btn.dataset.idProyecto;
                console.log(id);
                modal.show();
                const agregarActividadBtn = document.querySelector('.agregar-actividades');
                agregarActividadBtn.addEventListener('click', (e) => agregarActividad(id, e));
            });
        });

    });

      
}


async function agregarActividad(id, e) {
    console.log(id);
    e.preventDefault();
    const nombre = document.querySelector('#nombre-actividad').value;
    const fecha = document.querySelector('#fecha-actividad').value;
    const sede = document.querySelector('#sede-actividad').value;
    const descripcion = document.querySelector('#descripcion-actividad').value;
    // obtener el nombre de quien crea la actividad
    const token = localStorage.getItem('token');
    const nombreMiembro = convertirToken(token).nombre;
    console.log(nombreMiembro);

    const url = `http://localhost:3000/actividades/${id}`;
    const resultado = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            fecha,
            nombreMiembro,
            sede,
            nombre,
            descripcion,
            proyectoId: id
        })
    });
    const respuesta = await resultado.json();
    
    if(respuesta.ok == 'errores') {
        limpiarHTML();
        mostrarErroresActividades(respuesta.errors);
        return;
    }
    if(respuesta.ok == true) {
        limpiarHTML();
        modalActividadAgregada(respuesta.msg);
    }

}

function modalActividadAgregada(msg) {
    const formularioActividades = document.querySelector('.formulario-actividades');
    const modalTitle = document.querySelector('.modal-title');
    modalTitle.innerHTML = 'Actividad agregada ✅';
   resultadoActividades.innerHTML = `
   <div class="modal" id="myModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <h5>${msg}</h5>
                <p>✅</p>
            </div>
        </div>
    </div>
   `;
    const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    // ocultar modal de formulario de actividades
    formularioActividades.classList.add('d-none');
    // mostrar modal de actividad agregada por 3 segundos
    myModal.show();
    setTimeout(() => {
        myModal.hide();
        window.location.reload();
    }, 3000);
}

async function mostrarActividades(id, e) {
    e.preventDefault();
    const url = `http://localhost:3000/actividades/obtener-actividad/${id}`;
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
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
function mostrarErroresActividades(errors) {
  
    errors.forEach((error) => {
        const alerta = document.createElement('small');
        alerta.textContent = error.msg;
        alerta.classList.add('text-danger');
        resultadoActividades.appendChild(alerta);
        const br = document.createElement('br');
        resultadoActividades.appendChild(br);
    });

}


function mostrarError(error) {
    const alerta = document.createElement('small');
    alerta.textContent = error.msg;
    alerta.classList.add('text-danger');
    resultado.appendChild(alerta);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function convertirToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const obj = JSON.parse(jsonPayload);
    const nombre = obj.nombre;
    const AIMID = obj.AIMID;
    const id = obj.id;
    return {id, AIMID, nombre};
}