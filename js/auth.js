// archivo para comprobar si el usuario esta logueado o no
// si el usuario no esta logueado, redireccionar a la pagina de login
estaLogueado();
function estaLogueado() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'http://127.0.0.1:5500/HTML/logginProyectista.html';
    }
}
function cerrarSesion() {
    localStorage.removeItem('token');
    window.location.href = 'http://127.0.0.1:5500/HTML/logginProyectista.html';
}