// Redirigir al login después de 3 segundos
setTimeout(() => {
    window.location.href = './src/index/login.html';
}, 3000);

// Redirigir inmediatamente si el usuario toca la pantalla
document.addEventListener('click', function() {
    window.location.href = './src/index/login.html';
});

// Redirigir inmediatamente si presiona cualquier tecla
document.addEventListener('keydown', function() {
    window.location.href = './src/index/login.html';
});

// Mostrar porcentaje de carga en consola (opcional)
let progress = 0;
const interval = setInterval(() => {
    progress += 33;
    console.log(`Cargando: ${progress}%`);
    if (progress >= 100) {
        clearInterval(interval);
    }
}, 1000);