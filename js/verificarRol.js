
verificarRol();
function verificarRol() {
    const token = localStorage.getItem('token');
    const rol = convertirToken(token);
    console.log(rol);
    if (rol !== 'proyectista') {
        window.location.href = 'http://127.0.0.1:5500/HTML/homePage.html';
    }
}

function convertirToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}
