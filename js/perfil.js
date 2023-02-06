const divPerfil = document.querySelector('.profile-section__render');
const btnEditar = document.querySelector('#btnEditar');
const btnGuardar = document.querySelector('#btnGuardar');
cargarPerfil();
async function cargarPerfil() {

    // obtener el token del localstorage
    const token = localStorage.getItem('token'); 
    const id = convertirToken(token);
    const url = `http://localhost:3000/auth/obtener-usuario/${id}`;
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if(respuesta.ok === true) {
        const { usuario } = respuesta;
        const { AIMID, nombre, email, conocimientos, intereses, gradoEstudios } = usuario;
        divPerfil.innerHTML = `
        <div class="profile-picture">
            <img src="../static/IMG/profile.png" alt="Foto de Perfil">
        </div>
        <div class="profile-info">
            <h4 class="title">Informacion Personal</h4>
            <p>ID AIM: </p><input type="text" placeholder="${AIMID}" disabled ></input>
            <p>Nombre: </p><input type="text" placeholder="${nombre}" disabled ></input>
            <p>Correo Electronico: </p><input type="email" placeholder="${email}" disabled></input>
            <p>Grado: </p><input type="text" placeholder="${gradoEstudios}" disabled></input>

            <h4 class="title">Puesto</h4>
            <p>Asignado:</p><input type="text" placeholder="Encargado de diseño" disabled ></input>
            <h4 class="title">Datos de la cuenta</h4>
            <h4 class="title">Conocimientos</h4>
            <p>Conocimientos:</p><textarea placeholder="${conocimientos}" disabled ></textarea>
            <p>Intereses:</p><textarea placeholder="${intereses}" disabled ></textarea>
            <h4 class="title">Capitulos</h4>
            
        </div>
        `
    }
} 

btnEditar.addEventListener('click', editarPerfil);

async function editarPerfil() {
    // ocultar el boton de editar
    btnEditar.style.display = 'none';
    const token = localStorage.getItem('token');
    const id = convertirToken(token);
    const url = `http://localhost:3000/auth/obtener-usuario/${id}`;
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if(respuesta.ok === true) {
        const { usuario } = respuesta;
        const { AIMID, nombre, email, conocimientos, intereses, gradoEstudios } = usuario;
        divPerfil.innerHTML = `
        <div class="profile-picture">
            <img src="../static/IMG/profile.png" alt="Foto de Perfil">
        </div>
        <div class="profile-info">
            <h4 class="title">Informacion Personal</h4>
            <p>ID AIM: </p><input type="text" placeholder="${AIMID}" disabled ></input>
            <p>Nombre: </p><input type="text" placeholder="nombre" value="${nombre}"></input>
            <p>Correo Electronico: </p><input type="email" placeholder="email" value="${email}" ></input>
            <p>Grado: </p><input type="text" placeholder="grado de estudios" value="${gradoEstudios}" ></input>

            <h4 class="title">Puesto</h4>
            <p>Asignado:</p><input type="text" placeholder="Encargado de diseño" disabled ></input>
            <h4 class="title">Datos de la cuenta</h4>
            <h4 class="title">Conocimientos</h4>
            <p>Conocimientos:</p><textarea placeholder="conocimientos" value="">${conocimientos}</textarea>
            <p>Intereses:</p><textarea placeholder="intereses" value="" >${intereses}</textarea>
            <h4 class="title">Capitulos</h4>
            <div class="w-100 d-flex justify-content-center align-items-center">
                <button class="btn btn-success pt-2 p-2 font-weight-bold text-uppercase" onclick="guardarDatos(usuario)">Guardar</button>
            </div>
        </div>
        `
    } else {
        console.log('error');
    }
}

async function guardarDatos() {
    // obtener los datos del formulario

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