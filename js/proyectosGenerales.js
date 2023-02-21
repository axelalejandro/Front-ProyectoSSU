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

misProyectos.addEventListener('click', mostrarProyectos);
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
    const actividades = document.querySelector('#actividades').value;
    const actividadesArray = [];
    const responsable = document.querySelector('#responsable').value;
    const data = {
        nombre,
        IDproyectista,
        descripcion,
        personal,
        actividades,
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

obtenerPorcentaje();
async function obtenerPorcentaje() {
    const token = localStorage.getItem('token');
    const id = convertirToken(token).id;
    const url = `http://localhost:3000/actividades/${id}`;
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if(respuesta.ok === false){
        mostrarProyectos(respuesta.msg);
    }
    if(respuesta.ok === true) {
        mostrarProyectos(respuesta);
    }
}

async function obtenerActividades() {
    console.log('hola');
    const token = localStorage.getItem('token');
    const id = convertirToken(token).id;
    const url = `http://localhost:3000/actividades/${id}`;
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if(respuesta.ok === false){
        mostrarProyectos(respuesta.msg);
    }
    if(respuesta.ok === true) {
        mostrarActvidadesHTML(respuesta.actividades)
    }
}

function mostrarActvidadesHTML(actividades) {
    limpiarHTML();
    const div = document.createElement('div');
    div.classList.add('col-12');
    div.classList.add('col-md-6');
    div.classList.add('col-lg-4');
    div.classList.add('col-xl-3');
    div.classList.add('mb-4');
    div.classList.add('d-flex');
    div.classList.add('justify-content-center');
    div.classList.add('align-items-center');
    div.classList.add('actividades');
    div.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${actividades.nombre}</h5>
                <p class="card-text">${actividades.descripcion}</p>
                <p class="card-text">${actividades.fechaInicio}</p>
                <p class="card-text">${actividades.fechaFin}</p>
                <p class="card-text">${actividades.porcentaje}</p>
                <p class="card-text">${actividades.responsable}</p>
                <p class="card-text">${actividades.estado}</p>
                <p class="card-text">${actividades.proyectoId}</p>
                <p class="card-text">${actividades.usuarioId}</p>
            </div>
        </div>
    `;
    divActividades.appendChild(div);
}

mostrarProyectos();
async function mostrarProyectos(actividades) {
    divProyectos.classList.remove('d-none');
    formulario.classList.add('d-none');
    const token = localStorage.getItem('token');
    const id = convertirToken(token).id;
    const url = `http://localhost:3000/proyectos/${id}}`
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
    if(respuesta.ok === true) {
        mostrarProyectosHTML(respuesta.proyectos, actividades.porcentaje);
    }
    
}

async function mostrarProyectosValidados() {
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
        console.log(respuesta.proyectos);
        mostrarProyectosHTML(respuesta.proyectos);
    }
}
async function mostrarProyectosNoValidados() {
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
        mostrarProyectosHTML(respuesta.proyectos);
    }
}

function mostrarProyectosHTML(proyectos, porcentaje) {
    limpiarHTML();
    while(divProyecto.firstChild) {
        divProyecto.removeChild(divProyecto.firstChild);
    }
    proyectos.forEach(proyecto => {
        divProyecto.innerHTML += `
        <div class="proyecto-container "> 
            <div class="d-flex justify-content-between align-items-center m-2"> 
                <h4 class="titulo-proyectos" >${proyecto.nombre} </h4> 
                <small class="${proyecto.estado == 0 ? 'no-validado' : 'validado'}">${proyecto.estado == 0 ? 'No Validado' : 'Validado'}</small>
            </div>
            <div class="d-flex justify-content-between">
                <div> 
                <p><strong>Descripción:</strong><br> ${proyecto.descripcion}</p>
                <p><strong>Personal:</strong><br> ${proyecto.personal}</p>
                <p><strong>Actividades:</strong><br></p>
                <div class="actividades"></div>
                <ul class="lista"></ul>
                <p><strong>Responsable:</strong><br> ${proyecto.responsable}</p>
                </div>
                <div class="botones-proyecto d-flex flex-column justify-content-between gap-10">
                <button class="btn btn-primary">Editar</button>
                <button class="btn btn-danger">Eliminar</button>
                <button class="btn btn-secundary" onclick(mostrarActividades())>Ver actividad</button>
                </div>
            </div>
            <div class="progress">
                <div class="${porcentaje <= 0 ? 'text-dark': 'text-light'} progress-bar" role="progressbar" style="width: ${porcentaje}%;" aria-valuenow="${porcentaje}" aria-valuemin="0" aria-valuemax="100">${porcentaje}%</div>
            </div>
        </div>
        `;
    });
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
    const AIMID = obj.AIMID;
    const id = obj.id;
    return {id, AIMID};
}