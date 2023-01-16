// obtener lista de tareas

async function obtenerTareas() {
    const url = 'http://localhost:3000/tareas';
    const resultado = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const respuesta = await resultado.json();
    return respuesta;
}