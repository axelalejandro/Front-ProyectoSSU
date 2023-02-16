const misProyectos = document.querySelector('.mis-proyectos-li');
const agregarProyecto = document.querySelector('.agregar-proyectos');
const proyectosValidados = document.querySelector('.proyectos-validados');
const noValidados = document.querySelector('.no-validados');
const divProyectos = document.querySelector('.mis-proyectos');
const formulario = document.querySelector('.formulario');
const agregarProyectoBtn = document.querySelector('.agregar-proyecto');
const resultado = document.querySelector('.resultado');
const divRespuesta = document.querySelector('.resultado-proyectos');
misProyectos.addEventListener('click', mostrarProyectos);
agregarProyecto.addEventListener('click', mostrarFormulario);
agregarProyectoBtn.addEventListener('click', agregarProyectos);


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
        mostrarProyectos();
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
    const divProyecto = document.querySelector('.proyecto');
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
        divProyecto.innerHTML = `
        <h4>${respuesta.nombre}</h4>
        <p>${respuesta.descripcion}</p>
        <p>${respuesta.personal}</p>
        <p>${respuesta.actividades}</p>
        <p>${respuesta.responsable}</p>
        `;
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