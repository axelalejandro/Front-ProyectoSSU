const loginBtn = document.getElementById('ingresar');
const resultado = document.querySelector('.resultado');


loginBtn.addEventListener('click', registrar);

async function registrar(e) {
    e.preventDefault();
    // obtener los datos del formulario
    const AIMID = document.getElementById('aimid').value;
    const password = document.getElementById('password').value;
    const data = { AIMID, password };
    const url = 'http://localhost:3000/auth/registro';
    const resultado = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }); 
    const respuesta = await resultado.json();
    // comprueba si hay errores

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
        // extraer el token y guardar en el localstorage
        const { token } = respuesta;
        localStorage.setItem('token', token);
        // redireccionar a la pagina principal
        window.location.href = 'http://127.0.0.1:5500/HTML/HomePage.html';
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