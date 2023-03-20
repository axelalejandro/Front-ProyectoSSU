// obtener el id del evento de la url
const url = new URL(window.location.href);
const id = url.searchParams.get('id');
const urlAsistencias = `http://localhost:3000/asistencia`;
// console.log(id);

const idAIM = document.getElementById('id-aim');
const btnAsistencia = document.getElementById('confirmar-asistencia');
btnAsistencia.addEventListener('click', confirmarAsistencia);

async function confirmarAsistencia (e) {
    e.preventDefault();
    if(idAIM.value === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debes ingresar tu ID AIM',
        });
        return;
    }
    const registrarAsistencia = await fetch(`${urlAsistencias}/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            AIMID: idAIM.value,
        }),
    });
    const data = await registrarAsistencia.json();

    if(data.ok == false) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.msg,
        });
        return;
    }
    Swal.fire({
        icon: 'success',
        title: 'Asistencia confirmada',
        text: 'Gracias por asistir',
    }).then(() => {
        window.location.href = 'http://127.0.0.1:5500/HTML/HomePage.html';
    });

}