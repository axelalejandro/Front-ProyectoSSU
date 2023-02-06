const divPerfil = document.querySelector('.profile-section__render');
const btnEditar = document.querySelector('.btnEditar');
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
        const { AIMID, nombre, email, conocimientos, intereses, gradoEstudios } = usuario;
        divPerfil.innerHTML = `
        <div class="profile-picture">
            <img src="../static/IMG/profile.png" alt="Foto de Perfil">
        </div>
        <div class="profile-info">
            <h4 class="title">Informacion Personal</h4>
            <p>ID AIM: </p><input type="text" placeholder="${AIMID}" disabled ></input>
            <p>Nombre: </p><input type="text" placeholder="${nombre}" disabled ></input>
            <p>Correo Electronico: </p><input type="email" placeholder="${email}" disabled></input>
            <p>Grado: </p><input type="text" placeholder="${gradoEstudios}" disabled></input>

            <h4 class="title">Puesto</h4>
            <p>Asignado:</p><input type="text" placeholder="Encargado de diseño" disabled ></input>
            <h4 class="title">Datos de la cuenta</h4>
            <h4 class="title">Conocimientos</h4>
            <p>Conocimientos:</p><textarea placeholder="${conocimientos}" disabled ></textarea>
            <p>Intereses:</p><textarea placeholder="${intereses}" disabled ></textarea>
            <h4 class="title">Capitulos</h4>
            
        </div>
        `
    }
} 

async function editarPerfil() {
    
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