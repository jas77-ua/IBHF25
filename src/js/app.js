// DATOS DE LA APLICACIÓN
const estadoApp = {
    saldo: 127.80,
    metaAhorro: 200,
    // jaime
    tarjeta: {
        nombre: "Tarjeta de Débito (Visa)",
        numero: "4532123456784321", // se pueden cambiar los ultimos 4 digit
        bloqueada: false  //se activa si bloqueas la tarjeta
    },
    misiones: [
        {
            id: 1,
            titulo: "💰 Primer Ahorro Épico",
            descripcion: "Ahorra €50 este mes y gana recompensas especiales",
            recompensa: "+€5 bonus + Insignia",
            completada: false,
            progreso: 65
        },
        {
            id: 2,
            titulo: "🛡️ Cazador de Estafas",
            descripcion: "Aprende a identificar 3 casos de phishing reales",
            recompensa: "Avatar Exclusivo",
            completada: false,
            progreso: 30
        },
        {
            id: 3,
            titulo: "📈 Inversor Novato",
            descripcion: "Simula una inversión de €1000 en bolsa virtual",
            recompensa: "Desbloqueo Simulador Avanzado",
            completada: false,
            progreso: 10
        }
    ],
    transacciones: [
        { id: 1, nombre: "Paga Extra Papás", cantidad: 20, fecha: "Hoy, 10:30", tipo: "positivo" },
        { id: 2, nombre: "Steam - Videojuego", cantidad: 29.99, fecha: "Ayer, 16:45", tipo: "negativo" },
        { id: 3, nombre: "Ahorro Automático", cantidad: 10, fecha: "15 Oct, 08:00", tipo: "positivo" },
        { id: 4, nombre: "McDonald's", cantidad: 12.50, fecha: "14 Oct, 19:20", tipo: "negativo" }
    ]
};

// FUNCIONES DE LA APLICACIÓN
function actualizarSaldo() {
    const elementoSaldo = document.getElementById('saldo');
    elementoSaldo.textContent = `€${estadoApp.saldo.toFixed(2)}`;
    
    const progreso = (estadoApp.saldo / estadoApp.metaAhorro) * 100;
    const porcentajeProgreso = Math.min(progreso, 100);
    
    document.getElementById('texto-progreso').textContent = `${Math.round(porcentajeProgreso)}%`;
    document.getElementById('relleno-progreso').style.width = `${porcentajeProgreso}%`;
}

function renderizarMisiones() {
    const contenedor = document.getElementById('contenedor-misiones');
    contenedor.innerHTML = estadoApp.misiones.map(mision => `
        <div class="tarjeta-mision">
            <div class="titulo-mision">${mision.titulo}</div>
            <div class="descripcion-mision">${mision.descripcion}</div>
            <div class="recompensa-mision">${mision.recompensa}</div>
            <div class="progreso-mision">
                <div class="texto-progreso-mision">Progreso: ${mision.progreso}%</div>
                <div class="barra-progreso-mision">
                    <div class="relleno-progreso-mision" style="width: ${mision.progreso}%"></div>
                </div>
            </div>
            <button class="boton ${mision.completada ? 'boton-exito' : 'boton-principal'}" 
                    onclick="completarMision(${mision.id})"
                    ${mision.completada ? 'disabled' : ''}>
                ${mision.completada ? '✅ Completada' : 'Comenzar Misión'}
            </button>
        </div>
    `).join('');
}

function renderizarTransacciones() {
    const contenedor = document.getElementById('contenedor-transacciones');
    contenedor.innerHTML = estadoApp.transacciones.map(transaccion => `
        <div class="elemento-transaccion">
            <div class="info-transaccion">
                <div class="nombre-transaccion">${transaccion.nombre}</div>
                <div class="fecha-transaccion">${transaccion.fecha}</div>
            </div>
            <div class="cantidad-transaccion ${transaccion.tipo}">
                ${transaccion.tipo === 'positivo' ? '+' : '-'}€${transaccion.cantidad.toFixed(2)}
            </div>
        </div>
    `).join('');
}

// FUNCIONES DE SIMULACIÓN
function simularTransaccion(cantidad, descripcion) {
    estadoApp.saldo += cantidad;
    
    const nuevaTransaccion = {
        id: estadoApp.transacciones.length + 1,
        nombre: descripcion,
        cantidad: Math.abs(cantidad),
        fecha: 'Ahora mismo',
        tipo: cantidad > 0 ? 'positivo' : 'negativo'
    };
    
    estadoApp.transacciones.unshift(nuevaTransaccion);
    actualizarSaldo();
    renderizarTransacciones();
    
    // Efecto visual en el saldo
    const elementoSaldo = document.getElementById('saldo');
    elementoSaldo.style.transform = 'scale(1.1)';
    setTimeout(() => elementoSaldo.style.transform = 'scale(1)', 300);
}

function completarMision(idMision) {
    const mision = estadoApp.misiones.find(m => m.id === idMision);
    
    if (mision && !mision.completada) {
        mision.completada = true;
        mision.progreso = 100;
        
        // Recompensa económica si la hay
        if (mision.recompensa.includes('+€')) {
            const coincidenciaRecompensa = mision.recompensa.match(/\+€(\d+)/);
            if (coincidenciaRecompensa) {
                const cantidadRecompensa = parseInt(coincidenciaRecompensa[1]);
                estadoApp.saldo += cantidadRecompensa;
                simularTransaccion(cantidadRecompensa, `Recompensa: ${mision.titulo}`);
            }
        }
        
        renderizarMisiones();
        actualizarSaldo();
        
        alert(`🎉 ¡Misión completada! Recompensa: ${mision.recompensa}`);
    }
}

function completarMisionAleatoria() {
    const misionesIncompletas = estadoApp.misiones.filter(m => !m.completada);
    
    if (misionesIncompletas.length > 0) {
        const misionAleatoria = misionesIncompletas[Math.floor(Math.random() * misionesIncompletas.length)];
        completarMision(misionAleatoria.id);
    } else {
        alert('¡Todas las misiones están completadas! 🏆');
    }
}

function reiniciarDemo() {
    estadoApp.saldo = 127.80;
    
    estadoApp.misiones.forEach(mision => {
        mision.completada = false;
        if (mision.id === 1) mision.progreso = 65;
        else if (mision.id === 2) mision.progreso = 30;
        else mision.progreso = 10;
    });
    
    estadoApp.transacciones = [
        { id: 1, nombre: "Paga Extra Papás", cantidad: 20, fecha: "Hoy, 10:30", tipo: "positivo" },
        { id: 2, nombre: "Steam - Videojuego", cantidad: 29.99, fecha: "Ayer, 16:45", tipo: "negativo" },
        { id: 3, nombre: "Ahorro Automático", cantidad: 10, fecha: "15 Oct, 08:00", tipo: "positivo" },
        { id: 4, nombre: "McDonald's", cantidad: 12.50, fecha: "14 Oct, 19:20", tipo: "negativo" }
    ];
    
    actualizarSaldo();
    renderizarMisiones();
    renderizarTransacciones();
    
    alert('Demo reiniciada 🔄');
}

// RELOJ EN TIEMPO REAL
function actualizarReloj() {
    const ahora = new Date();
    const textoHora = ahora.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    document.getElementById('hora-actual').textContent = textoHora;
}


function mostrarSeccion(seccion) {
    const seccionTarjetas = document.getElementById('seccion-tarjetas');
    const bannerTarjeta = document.querySelector('.banner-tarjeta');
    const seccionMisiones = document.querySelector('.seccion:nth-of-type(1)');
    const seccionTransacciones = document.querySelector('.seccion:nth-of-type(2)');

    if (seccion === 'inicio') {
        // Mostrar todo lo del inicio
        if (bannerTarjeta) bannerTarjeta.style.display = '';
        if (seccionMisiones) seccionMisiones.style.display = '';
        if (seccionTransacciones) seccionTransacciones.style.display = '';
        if (seccionTarjetas) seccionTarjetas.style.display = 'none';
    }
    else if (seccion === 'tarjetas') {
        // Ocultar inicio, mostrar tarjetas
        if (bannerTarjeta) bannerTarjeta.style.display = 'none';
        if (seccionMisiones) seccionMisiones.style.display = 'none';
        if (seccionTransacciones) seccionTransacciones.style.display = 'none';
        if (seccionTarjetas) {
            seccionTarjetas.style.display = 'block';
            // Actualizar últimos dígitos
            const ultimos = document.getElementById('ultimos-digitos-tarjeta');
            if (ultimos) {
                ultimos.textContent = estadoApp.tarjeta.numero.slice(-4);
            }

            // Mostrar u ocultar botones según estado
            const btnBloquear = document.getElementById('bloquear-tarjeta');
            const btnDesbloquear = document.getElementById('desbloquear-tarjeta');
            if (btnBloquear && btnDesbloquear) {
                if (estadoApp.tarjeta.bloqueada) {
                    btnBloquear.style.display = 'none';
                    btnDesbloquear.style.display = '';
                } else {
                    btnBloquear.style.display = '';
                    btnDesbloquear.style.display = 'none';
                }
            }
        }
    }
}


// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    // Configurar reloj
    actualizarReloj();
    setInterval(actualizarReloj, 60000);
    
    // Renderizar contenido inicial
    actualizarSaldo();
    renderizarMisiones();
    renderizarTransacciones();
    
    // Configurar eventos de navegación
    document.querySelectorAll('.elemento-nav').forEach(elemento => {
        elemento.addEventListener('click', function() {
            document.querySelectorAll('.elemento-nav').forEach(nav => nav.classList.remove('activo'));
            this.classList.add('activo');
            
            const pagina = this.getAttribute('data-pagina');
            console.log(`Navegando a: ${pagina}`);
        });
    });
    
    // Configurar botones de control
    document.getElementById('añadir-dinero').addEventListener('click', () => {
        simularTransaccion(20, 'Paga extra');
    });
    
    document.getElementById('gastar-dinero').addEventListener('click', () => {
        simularTransaccion(-15, 'Compra juegos');
    });
    
    document.getElementById('completar-mision').addEventListener('click', () => {
        completarMisionAleatoria();
    });
    
    document.getElementById('reiniciar-demo').addEventListener('click', () => {
        reiniciarDemo();
    });

    // jaime
    // Mostrar info de la tarjeta al cargar
    const nombreTarjetaEl = document.getElementById('nombre-tarjeta');
    const terminaEnEl = document.getElementById('termina-en');
    if (nombreTarjetaEl && terminaEnEl) {
        nombreTarjetaEl.textContent = estadoApp.tarjeta.nombre;
        terminaEnEl.textContent = `Termina en ${estadoApp.tarjeta.numero.slice(-4)}`;
    }

    // Configurar clic en el banner de tarjeta
    const bannerTarjeta = document.getElementById('banner-tarjeta');
    if (bannerTarjeta) {
        bannerTarjeta.addEventListener('click', () => {
            mostrarSeccion('tarjetas');
        });
    }

    // Volver desde tarjetas al inicio
    const botonVolver = document.getElementById('boton-volver-tarjetas');
    if (botonVolver) {
        botonVolver.addEventListener('click', () => {
            mostrarSeccion('inicio');
        });
    }

        // Acción: Bloquear tarjeta
    document.getElementById('bloquear-tarjeta').addEventListener('click', () => {
        if (estadoApp.tarjeta.bloqueada) {
            alert('⚠️ Esta tarjeta ya está bloqueada.');
            return;
        }

        if (confirm('¿Seguro que quieres bloquear tu tarjeta?\n\nNo podrás hacer pagos hasta que la desbloquees.')) {
            estadoApp.tarjeta.bloqueada = true;
            alert('✅ Tarjeta bloqueada con éxito.\nContacta con soporte para desbloquearla.');
            
            // Actualizar el banner en la vista principal
            const nombreTarjetaEl = document.getElementById('nombre-tarjeta');
            if (nombreTarjetaEl) {
                nombreTarjetaEl.textContent = 'Tarjeta Bloqueada 🔒';
            }
            
            // Volver al inicio después de 1 segundo
            setTimeout(() => {
                mostrarSeccion('inicio');
            }, 1000);
        }
    });

        // Acción: Desbloquear tarjeta
    document.getElementById('desbloquear-tarjeta').addEventListener('click', () => {
        if (!estadoApp.tarjeta.bloqueada) {
            alert('ℹ️ La tarjeta ya está activa.');
            return;
        }

        if (confirm('¿Seguro que quieres desbloquear tu tarjeta?')) {
            estadoApp.tarjeta.bloqueada = false;
            alert('✅ Tarjeta desbloqueada con éxito.');

            // Restaurar el nombre original en el banner
            const nombreTarjetaEl = document.getElementById('nombre-tarjeta');
            if (nombreTarjetaEl) {
                nombreTarjetaEl.textContent = estadoApp.tarjeta.nombre;
            }

            // Ocultar el botón de desbloquear y mostrar el de bloquear
            document.getElementById('desbloquear-tarjeta').style.display = 'none';
            document.getElementById('bloquear-tarjeta').style.display = '';

            // Volver al inicio
            setTimeout(() => {
                mostrarSeccion('inicio');
            }, 1000);
        }
    });
    
    console.log('🚀 Aplicación Sabadell NEXT iniciada correctamente');
});