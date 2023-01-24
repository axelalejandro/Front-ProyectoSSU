const enviarCorreo = document.getElementById('enviar-correo');
const resultado = document.querySelector('.resultado');

enviarCorreo.addEventListener('click', enviar)

async function enviar(e) {
    e.preventDefault();
    const email = document.getElementById('email-correo').value;
    const asunto = document.getElementById('asunto-correo').value;
    const mensaje = document.getElementById('mensaje-correo').value;

    const data = {
        email,
        asunto,
        mensaje
    }
    const token = localStorage.getItem('token');
    const id = convertirToken(token);
    const url = `http://localhost:3000/enviar-mensaje/${id}`;
    const resultado = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if (respuesta.ok === 'errores') {
        limpiarHTML();
        mostrarErrores(respuesta.errores);
        return
    }
    if(respuesta.ok === false){
        limpiarHTML();
        mostrarError(respuesta);
        return
    }
    if(respuesta.ok === true){
        limpiarHTML();
        mostrarModal();
        mostrarCorreos();
    }
    
}

mostrarCorreos();

async function mostrarCorreos() {
    const token = localStorage.getItem('token');
    const id = convertirToken(token);
    const url = `http://localhost:3000/ver-mensajes/${id}`;
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    console.log(respuesta)
    if (respuesta.ok === false) {
        mostrarCorreosHTML(respuesta);
    }   
    if(respuesta.ok === true){
        mostrarCorreosHTML(respuesta);
  
    }
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
        resultado.removeChild(resultado);
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

function mostrarModal() {
    // modal de confirmacion de envio de correo
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.classList.add('fade');
    modal.setAttribute('id', 'modal');
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'exampleModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-success" id="exampleModalLabel">Correo enviado</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>El correo se ha enviado correctamente</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>

    `;
    resultado.appendChild(modal);
    const modalBootstrap = new bootstrap.Modal(modal);
    modalBootstrap.show();
    // quitamos el modal despues de 3 segundos
    const formulario = document.getElementById('formulario');
    formulario.classList.add('d-none');
    setTimeout(() => {
        modalBootstrap.hide();
        modal.remove();
        window.location.reload();
    }, 4000);
}

function mostrarCorreosHTML(correos) {
    console.log(correos)
    const divCorreos = document.querySelector('.correos-container');
    if(correos.mensajesUsuario.length === 0){
        const alerta = document.createElement('h4');
        alerta.textContent = 'No hay correos';
        alerta.classList.add('text-center');
        divCorreos.appendChild(alerta);
        return
    }
    correos.mensajesUsuario.forEach((correo) => {
        console.log({correo})
        divCorreos.innerHTML += `
        <div class="mx-auto">
            <div class="card-body" style="display: contents; justify-content: center;">
            <!-- Button trigger modal -->
            <div class="boton-modal">
                <label for="btn-modal"><p>De:${correo.usuarioEnvia}</p><p>${correo.asunto}</p></label>
            </div>
            </div>
        </div>
    <input type="checkbox" name="" id="btn-modal">

    <div class="container-modal">
        <div class="content-modal">
        <h2>De: ${correo.usuarioEnvia}</h2>
        <h4>Asunto: ${correo.asunto}</h4>
        <p>${correo.mensaje}</p>
        <div class="content-botones">
            <div class="btn-responder">
            <label for="btn-modal">Responder</label>
            </div>
            <div class="btn-cerrar">
            <label for="btn-modal">Cerrar</label>
            </div>
        </div>
        </div>
        <label for="btn-modal" class="cerrar-Modal"></label>
    </div>
        `;
    });
}