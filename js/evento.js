// obtener id de la url
const url = new URL(window.location.href);
const id = url.searchParams.get('id');
const URL_BASE = 'http://localhost:3000/eventos'

// obtener datos de la api
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
        `

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