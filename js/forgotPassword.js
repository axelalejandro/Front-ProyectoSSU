const btnEnviar = document.getElementById('enviar-datos');
const divResultado = document.querySelector('.resultado');

btnEnviar.addEventListener('click', enviarDatos);

async function enviarDatos(e) {
    e.preventDefault();
    const email = document.getElementById('enviar-olvide').value;
    const data = { email };
    const url = `http://localhost:3000/auth/olvide-password`;
    const resultado = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const respuesta = await resultado.json();
    console.log(respuesta)
    if (respuesta.ok === false) {
        limpiarHTML();
        const error = document.createElement('small');
        error.textContent = respuesta.msg;
        error.classList.add('text-danger');
        divResultado.appendChild(error);
        return
    }
    if(respuesta.ok === true){
        window.location.href = 'http://127.0.0.1:5500/HTML/modalRecuperarPass.html';
    }
}

function limpiarHTML() {
    while (divResultado.firstChild) {
        divResultado.removeChild(divResultado.firstChild);
    }
}