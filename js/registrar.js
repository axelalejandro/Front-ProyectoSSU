const loginBtn = document.getElementById('registrar');
const resultado = document.querySelector('.resultado');

loginBtn.addEventListener('click', ingresar);

async function ingresar(e) {
    e.preventDefault();
    // obtener los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repetir_password = document.getElementById('repetir_password').value;
    const ciudad = document.getElementById('ciudad').value;
    const fecha = document.getElementById('fecha').value;
    const gradoEstudios = document.getElementById('grado').value;
    let suscripcion = document.getElementById('suscripcion').value;
    const conocimientos = document.getElementById('conociminetos').value;
    const intereses = document.getElementById('intereses').value;
    const fechaNacimiento = fecha.split('-').reverse().join('-');
    if(suscripcion === 'si') {
        suscripcion = true;
    } else if(suscripcion === 'no') {
        suscripcion = false;
    }
    const data = {
        nombre,
        email,
        password,
        repetir_password,
        ciudad,
        fechaNacimiento,
        gradoEstudios,
        suscripcion,
        conocimientos,
        intereses
    }
    const url = 'http://localhost:3000/auth/registro';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const resultado = await fetch(url, options);
    const respuesta = await resultado.json();
    // comprueba si hay errores
    try {
        if (respuesta.ok === 'errores') {
            limpiarHTML();
            mostrarErrores(respuesta.errors);
        }
        if(respuesta.ok === false){
            limpiarHTML();
            mostrarError(respuesta);
        }
        if(respuesta.ok === true){
            limpiarHTML();
            console.log(respuesta);
            window.location.href = 'http://127.0.0.1:5500/HTML/confirmarCuenta.html';
        }
    } catch (error) {
        console.log(error);
    }

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