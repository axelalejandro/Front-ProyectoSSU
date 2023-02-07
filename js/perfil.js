const divPerfil = document.querySelector('.profile-section__render');
const btnEditar = document.querySelector('#btnEditar');
const btnGuardar = document.querySelector('#btnGuardar');
const divResultado = document.querySelector('.resultado');

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
        const { AIMID, nombre, email, ciudad, conocimientos, intereses, gradoEstudios, fechaNacimiento, suscripcion } = usuario;
        const AIMIDInput = document.querySelector('.AIMID');
        const nombreInput = document.querySelector('.nombre');
        const emailInput = document.querySelector('.email');
        const gradoInput = document.querySelector('.grado');
        const fechaInput = document.querySelector('.fecha');
        const suscripcionInput = document.querySelector('.suscripcion');
        const conocimientosInput = document.querySelector('.conocimientos');
        const interesesInput = document.querySelector('.intereses');
        const ciudadInput = document.querySelector('.ciudad');
        // formatear la fecha de nacimiento a español en string
        fechaFormateada = formatearFecha(fechaNacimiento);

        if(suscripcion === true) {
            suscripcionInput.value = 'Activa';
        }
        else {
            suscripcionInput.value = 'Inactiva';
        }
        AIMIDInput.value = AIMID;
        nombreInput.value = nombre;
        emailInput.value = email;
        gradoInput.value = gradoEstudios;
        fechaInput.value = fechaFormateada;
        conocimientosInput.value = conocimientos;
        interesesInput.value = intereses;
        ciudadInput.value = ciudad;
    }
} 

btnEditar.addEventListener('click', editarPerfil);

async function editarPerfil(e) {
    e.preventDefault();
    limpiarHTML();
    const nombreInput = document.querySelector('.nombre');
    const emailInput = document.querySelector('.email');
    const gradoInput = document.querySelector('.grado');
    const gradoInputSelect = document.querySelector('#grado');
    const fechaInput = document.querySelector('.fecha');
    const suscripcionInput = document.querySelector('.suscripcion');
    const conocimientosInput = document.querySelector('.conocimientos');
    const interesesInput = document.querySelector('.intereses');
    const ciudadInput = document.querySelector('.ciudad');
    // quitar input de suscripcion
    gradoInput.classList.add('d-none');
    gradoInputSelect.classList.add('d-block');
    gradoInputSelect.value = gradoInput.value;
    nombreInput.disabled = false;
    emailInput.disabled = false;
    gradoInput.disabled = false;
    fechaInput.disabled = false;
    conocimientosInput.disabled = false;
    interesesInput.disabled = false;
    ciudadInput.disabled = false;
    btnGuardar.classList.remove('d-none');
    btnEditar.classList.add('d-none');
    btnGuardar.addEventListener('click', guardarPerfilDB);
}

async function guardarPerfilDB(e) {
    e.preventDefault();
    const nombreInput = document.querySelector('.nombre');
    const emailInput = document.querySelector('.email');
    const gradoInputSelect = document.querySelector('#grado');
    const fechaInput = document.querySelector('.fecha');
    const suscripcionInput = document.querySelector('.suscripcion');
    if(suscripcionInput.value === 'Activa') {
        suscripcionInput.value = true;
    } else {
        suscripcionInput.value = false;
    }
    const conocimientosInput = document.querySelector('.conocimientos');
    const interesesInput = document.querySelector('.intereses');
    const ciudadInput = document.querySelector('.ciudad');
    const token = localStorage.getItem('token'); 
    const id = convertirToken(token);
    const url = `http://localhost:3000/auth/editar-perfil/${id}`;
    const resultado = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            nombre: nombreInput.value,
            email: emailInput.value,
            gradoEstudios: gradoInputSelect.value,
            fechaNacimiento: fechaInput.value,
            suscripcion: suscripcionInput.value,
            conocimientos: conocimientosInput.value,
            intereses: interesesInput.value,
            ciudad: ciudadInput.value
        })
    });
    const respuesta = await resultado.json();
    if(respuesta.ok === "errores") {
        limpiarHTML();
        divResultado.classList.add('d-flex');
        mostrarErrores(respuesta.errors);
        window.scrollTo(0, 0);
    }
    if(respuesta.ok === true) {
        // recargar la pagina
        window.scrollTo(0, 0);
        mostrarModal('Perfil actualizado correctamente');
    }
        
}

function mostrarModal(mensaje) {
    const modalFondo = document.createElement('div');
    modalFondo.classList.add('fondo-modal');
    const modal = document.createElement('div');
    modal.classList.add('modal-active');
    modal.innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center">
            <p>${mensaje}</p>
            <p class="icon-modal">✅</p>
        </div>
    `;
    // crear boton para cerrar modal
    const btnCerrar = document.createElement('button');
    btnCerrar.classList.add('btn', 'btn-cerrar');
    btnCerrar.textContent = 'X';
    modal.appendChild(btnCerrar);
    modalFondo.appendChild(modal);
    document.body.appendChild(modalFondo);
    modalFondo.addEventListener('click', () => {
        modalFondo.remove();
        window.location.reload();
        cargarPerfil();
    });
}


function formatearFecha(fecha) {
    const fechaNacimientoFormateada = new Date(fecha).toLocaleDateString('es-ES');
    const fechaString = fechaNacimientoFormateada.split('/');
    const dia = fechaString[0];
    const mes = fechaString[1];
    const anio = fechaString[2];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const mesString = meses[mes - 1];
    const fechaNacimientoFormateadaString = `${dia} de ${mesString} de ${anio}`;
    return fechaNacimientoFormateadaString;
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
    while (divResultado.firstChild) {
        divResultado.removeChild(divResultado.firstChild);
    }
}

function mostrarErrores(errors) {
  
    errors.forEach((error) => {
        const alerta = document.createElement('small');
        alerta.textContent = error.msg;
        alerta.classList.add('text-danger', 'font-weight-bold', 'text-uppercase', 'alert-heading', 'text-center' );
        divResultado.appendChild(alerta);

    });

}

function mostrarError(error) {
    const alerta = document.createElement('small');
    alerta.textContent = error.msg;
    alerta.classList.add('text-danger');
    resultado.appendChild(alerta);
}