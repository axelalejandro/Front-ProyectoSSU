function cerrarSesion() {
    localStorage.removeItem('token');
    window.location.href = 'http://127.0.0.1:5500/HTML/logginProyectista.html';
}