function cerrarSesion() {
    localStorage.removeItem('token');
    window.location.href = 'http://127.0.0.1:5500/HTML/logginProyectista.html';
}

const proyectosContainer = document.querySelector('.proyectos-container');

obtenerProyectosRecientes();
async function obtenerProyectosRecientes() {
    const url = 'http://localhost:3000/proyectos/recientes';
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    if(respuesta.ok == false) {
        while(proyectosContainer.firstChild) {
            proyectosContainer.removeChild(proyectosContainer.firstChild);
        }
        const mensaje = document.createElement('p');
        mensaje.textContent = respuesta.msg;
        mensaje.classList.add('text-white', 'text-center', 'font-weight-bold', 'm-auto', 'fs-3');
        proyectosContainer.appendChild(mensaje);
        return;
    }
    if(respuesta.ok == true) {
        mostrarProyectos(respuesta.proyectos);
    }
}

function mostrarProyectos(proyectos) {
    proyectos.forEach(proyecto => {
        proyectosContainer.innerHTML += `
        <div class="proyectos-card">
            <div class="proyectos-card-info p-3">
                <h5 class="titulos-proyectos">${proyecto.nombre}</h5>
                <p class="descripcion-proyectos"><strong>Descripcion:</strong> <br>
                ${proyecto.descripcion}</p>
                <button class="button">Ver Mas!</button>
            </div>
        </div>
        `
    });
}
// Obtén el contenedor donde mostrarás el código QR
var qrcodeContainer = document.getElementById('qrcode');

// Crea el código QR con la información de tu evento
var qrcode = new QRCode(qrcodeContainer, {
    text: 'http://127.0.0.1:5500/HTML/formularioProyectos.html',
    width: 200,
    height: 200
});

// Redirige al usuario a la página web del evento cuando escanea el código QR
qrcodeContainer.addEventListener('click', function() {
    window.location.href = 'http://127.0.0.1:5500/HTML/formularioProyectos.html';
});
