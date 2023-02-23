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
    const urlActividades = `http://localhost:3000/actividades/${id}`;
    const [resultadoProyectos, resultadoActividades] = await Promise.all([
        fetch(urlProyectos, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }),
        fetch(urlActividades, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    ]);
    const respuestaProyectos = await resultadoProyectos.json();
    const respuestaActividades = await resultadoActividades.json();
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
    mostrarProyectosHTML(respuestaProyectos.proyectos, respuestaActividades.actividades??[], respuestaActividades.porcentaje??0);
    
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
        mostrarProyectosHTML(respuesta.proyectos, [], undefined);
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
        mostrarProyectosHTML(respuesta.proyectos, [], undefined);
        return
    }
}


function mostrarProyectosHTML(proyectos, actividades = [], porcentaje = undefined) {
    limpiarHTML();
    while(divProyecto.firstChild) {
        divProyecto.removeChild(divProyecto.firstChild);
    }
    if(porcentaje !== undefined) {
        proyectos.forEach(proyecto => {
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
                        <ul class="lista d-flex flex-column"></ul>
                        <button class="btn btn-secundary")>Agregar actividad</button>
                    </div>
                    <p><strong>Responsable:</strong><br> ${proyecto.responsable}</p>
                    </div>
                </div>
                <div class="progress">
                    <div class="${porcentaje <= 0 ? 'text-dark': 'text-light'} progress-bar" role="progressbar" style="width: ${porcentaje}%;" aria-valuenow="${porcentaje}" aria-valuemin="0" aria-valuemax="100">${porcentaje}%</div>
                </div>
                <div class="d-flex justify-content-center align-items-center m-2">
                    <button class="btn btn-primary m-2">Editar</button>
                    <button class="btn btn-danger">Eliminar</button>
                </div>
            </div>
            `;
            const lista = document.querySelector('.lista');
            while(lista.firstChild) {
                lista.removeChild(lista.firstChild);
            }
            if(actividades.length == 0) {
                lista.innerHTML = `<p class="text-center">No hay actividades</p>`;

            }
            actividades.forEach(actividad => {

                lista.innerHTML += `
                <button class="btn mb-2 btn-sm ${actividad.estado == 0 ? "btn-success" : "btn-warning btn-completo"}" onclick="mostrarActividades(${actividad.id})">${actividad.nombre} </button>
                `;
            });
        });
    } else { 
        proyectos.forEach(proyecto => {
            divProyecto.innerHTML += `
            <div class="proyecto-container "> 
                <div class="d-flex justify-content-between align-items-center m-2"> 
                    <h4 class="titulo-proyectos" >${proyecto.nombre} </h4> 
                    <small class="${proyecto.estado == 0 ? 'no-validado' : 'validado'}">${proyecto.estado == 0 ? 'No Validado' : 'Validado'}</small>
                </div>
            `;
        });
        
    }

}

async function mostrarActividades(id) {
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