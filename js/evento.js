// obtener id de la url
const url = new URL(window.location.href);
const id = url.searchParams.get('id');
const URL_BASE = 'http://localhost:3000/eventos'

obtenerEvento();
async function obtenerEvento(){
    const res = await fetch(`${URL_BASE}/${id}`);
    const evento = await res.json();
    console.log(evento);
    if(evento.ok === false){
        window.location.href = 'http://127.0.0.1:5500/HTML/HomePage.html';
        return
    }

    // mostrar datos en el html
    const {nombre, descripcion, fecha, hora, lugar, duracion} = evento.evento;
    fechaFormateada = formatearFecha(fecha);
    const duracionDosDecimales = duracion.slice(0, 4) + 'h';
    const cardEvento = document.querySelector('.card-evento');
    cardEvento.innerHTML = `
        <h1>${nombre}</h1>
        <p>${descripcion}</p>
        <p>${fechaFormateada} a las ${hora}h</p>
        <p></p>
        <p>Lugar: ${lugar}</p>
        <p>Duracion: ${duracionDosDecimales}</p>
        <div class="qr-container w-full d-flex justify-content-center">
            <div class="w-full" id="qrcode"></div>
        </div>
        `
        // Obtén el contenedor donde mostrarás el código QR
        let qrcodeContainer = document.getElementById('qrcode');

        // Crea el código QR con la información de tu evento
        let qrcode = new QRCode(qrcodeContainer, {
            text: `http://127.0.0.1:5500/HTML/asistencia.html?id=${id}`,
            width: 200,
            height: 200
        });

        // Redirige al usuario a la página web del evento cuando escanea el código QR
        qrcodeContainer.addEventListener('click', function() {
            window.location.href = `http://127.0.0.1:5500/HTML/asistencia.html?id=${id}`;
        });

        // descargar codigo qr
        let downloadBtn = document.createElement('button');
        let spanButton = document.createElement('span');
        spanButton.textContent = 'Descargar código QR';
        downloadBtn.addEventListener('click', function() {
            // Obténer la imagen del código QR
            let qrImage = qrcodeContainer.getElementsByTagName('img')[0];

            // Crea un enlace para descargar la imagen
            let downloadLink = document.createElement('a');
            downloadLink.href = qrImage.src;
            downloadLink.download = `${nombre}.png`;

            // Agrega el enlace a la página y haz clic en él para descargar la imagen
            cardEvento.appendChild(downloadLink);
            downloadLink.click();
            cardEvento.removeChild(downloadLink);
        });

        // Agrega el botón de descarga a la página
        downloadBtn.appendChild(spanButton);
        cardEvento.appendChild(downloadBtn);

};

function formatearFecha(fecha){
    // formatear fecha a 10 de mayo de 2021
    const fechaFormateada = new Date(fecha);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dia = fechaFormateada.getDate();
    const mes = meses[fechaFormateada.getMonth()];
    const anio = fechaFormateada.getFullYear();
    return `${dia} de ${mes} de ${anio}`;
}


