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

misProyectos.addEventListener('click', mostrarProyectos);
agregarProyecto.addEventListener('click', mostrarFormulario);
agregarProyectoBtn.addEventListener('click', agregarProyectos);
proyectosValidados.addEventListener('click', mostrarProyectosValidados);


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

mostrarProyectos();
async function mostrarProyectos() {
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
        mostrarProyectosHTML(respuesta.proyectos);
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
    if(respuesta.ok === true) {
        mostrarProyectosHTML(respuesta.proyectos);
    }
}



function mostrarProyectosHTML(proyectos) {
    limpiarHTML();
    proyectos.forEach(proyecto => {
        console.log(proyecto);
        divProyecto.innerHTML += `
        <div class="proyecto-container "> 
            <h4 class="text-center">${proyecto.nombre}</h4>
            <div class="d-flex justify-content-between">
                <div> 
                <p><strong>Descripción:</strong><br> ${proyecto.descripcion}</p>
                <p><strong>Personal:</strong><br> ${proyecto.personal}</p>
                <p><strong>Actividades:</strong><br> ${proyecto.actividades}</p>
                <p><strong>Responsable:</strong><br> ${proyecto.responsable}</p>
                </div>
                <div class="botones-proyecto d-flex flex-column justify-content-between gap-10">
                <button class="btn btn-primary">Editar</button>
                <button class="btn btn-danger">Eliminar</button>
                <button class="btn btn-secundary">Agregar actividad</button>
                </div>
            </div>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
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