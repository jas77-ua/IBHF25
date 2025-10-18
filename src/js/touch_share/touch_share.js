// Variables globales
let deudas = [];
let pagosRealizados = [];
let simulandoNFC = false;
let intervaloNFC;

// Elementos del DOM
const montoTotalInput = document.getElementById('monto-total');
const numeroPersonasInput = document.getElementById('numero-personas');
const calcularBtn = document.getElementById('calcular');
const seccionResultados = document.getElementById('seccion-resultados');
const totalMostrar = document.getElementById('total-mostrar');
const cuotaMostrar = document.getElementById('cuota-mostrar');
const listaDeudas = document.getElementById('lista-deudas');
const activarNFCBtn = document.getElementById('activar-nfc');
const estadoNFC = document.getElementById('estado-nfc');
const listaPagos = document.getElementById('lista-pagos');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos guardados si existen
    cargarDatosGuardados();
    
    // Configurar event listeners
    calcularBtn.addEventListener('click', calcularReparto);
    activarNFCBtn.addEventListener('click', toggleNFC);
    
    // Mostrar historial de pagos
    actualizarHistorialPagos();
});

// Función para calcular el reparto
function calcularReparto() {
    const montoTotal = parseFloat(montoTotalInput.value);
    const numeroPersonas = parseInt(numeroPersonasInput.value);
    
    // Validaciones
    if (isNaN(montoTotal) || montoTotal <= 0) {
        alert('Por favor, introduce un monto total válido');
        return;
    }
    
    if (isNaN(numeroPersonas) || numeroPersonas < 2) {
        alert('Por favor, introduce un número válido de personas (mínimo 2)');
        return;
    }
    
    // Calcular cuota por persona
    const cuotaPorPersona = montoTotal / numeroPersonas;
    
    // Mostrar resultados
    totalMostrar.textContent = `${montoTotal.toFixed(2)}€`;
    cuotaMostrar.textContent = `${cuotaPorPersona.toFixed(2)}€`;
    
    // Generar deudas
    generarDeudas(numeroPersonas, cuotaPorPersona);
    
    // Mostrar sección de resultados
    seccionResultados.style.display = 'block';
    
    // Guardar datos
    guardarDatos();
}

// Función para generar las deudas
function generarDeudas(numeroPersonas, cuotaPorPersona) {
    deudas = [];
    listaDeudas.innerHTML = '';
    
    for (let i = 1; i <= numeroPersonas; i++) {
        const deuda = {
            id: i,
            persona: `Persona ${i}`,
            monto: cuotaPorPersona,
            pagado: false
        };
        
        deudas.push(deuda);
        
        // Crear elemento HTML para la deuda
        const elementoDeuda = document.createElement('div');
        elementoDeuda.className = 'item-deuda';
        elementoDeuda.innerHTML = `
            <span>${deuda.persona}</span>
            <span class="deuda-pendiente">${deuda.monto.toFixed(2)}€</span>
        `;
        
        listaDeudas.appendChild(elementoDeuda);
    }
}

// Función para activar/desactivar NFC
function toggleNFC() {
    if (simulandoNFC) {
        // Detener simulación NFC
        detenerSimulacionNFC();
        activarNFCBtn.textContent = '📱 Activar NFC';
        activarNFCBtn.classList.remove('animacion-nfc');
        estadoNFC.innerHTML = '';
        estadoNFC.className = 'estado-nfc';
    } else {
        // Iniciar simulación NFC
        if (deudas.length === 0) {
            alert('Primero debes calcular un reparto de gastos');
            return;
        }
        
        iniciarSimulacionNFC();
        activarNFCBtn.textContent = '🛑 Detener NFC';
        activarNFCBtn.classList.add('animacion-nfc');
    }
    
    simulandoNFC = !simulandoNFC;
}

// Función para iniciar la simulación NFC
function iniciarSimulacionNFC() {
    estadoNFC.innerHTML = '<p class="estado-conectando">Buscando dispositivo NFC...</p>';
    estadoNFC.className = 'estado-nfc estado-conectando';
    
    // Simular conexión NFC después de un tiempo
    let intentos = 0;
    const maxIntentos = 5;
    
    intervaloNFC = setInterval(() => {
        intentos++;
        
        if (intentos <= maxIntentos) {
            estadoNFC.innerHTML = `<p class="estado-conectando">Buscando dispositivo NFC... (${intentos}/${maxIntentos})</p>`;
            
            // Simular conexión exitosa después de algunos intentos
            if (intentos === 3) {
                clearInterval(intervaloNFC);
                simularPagoExitoso();
            }
        } else {
            // Simular fallo en la conexión
            clearInterval(intervaloNFC);
            simularFalloConexion();
        }
    }, 1500);
}

// Función para detener la simulación NFC
function detenerSimulacionNFC() {
    if (intervaloNFC) {
        clearInterval(intervaloNFC);
    }
}

// Función para simular un pago exitoso
function simularPagoExitoso() {
    // Encontrar la primera deuda pendiente
    const deudaPendiente = deudas.find(deuda => !deuda.pagado);
    
    if (deudaPendiente) {
        // Marcar como pagada
        deudaPendiente.pagado = true;
        
        // Registrar pago
        const pago = {
            id: pagosRealizados.length + 1,
            persona: deudaPendiente.persona,
            monto: deudaPendiente.monto,
            fecha: new Date().toLocaleString()
        };
        
        pagosRealizados.push(pago);
        
        // Actualizar interfaz
        actualizarListaDeudas();
        actualizarHistorialPagos();
        
        // Mostrar estado exitoso
        estadoNFC.innerHTML = `
            <p class="estado-exitoso">¡Pago realizado con éxito!</p>
            <p>${deudaPendiente.persona} ha pagado ${deudaPendiente.monto.toFixed(2)}€</p>
        `;
        estadoNFC.className = 'estado-nfc estado-exitoso';
        
        // Guardar datos
        guardarDatos();
        
        // Verificar si todas las deudas están pagadas
        if (deudas.every(deuda => deuda.pagado)) {
            setTimeout(() => {
                estadoNFC.innerHTML += '<p>¡Todas las deudas han sido saldadas!</p>';
            }, 1000);
        }
    } else {
        estadoNFC.innerHTML = '<p class="estado-exitoso">Todas las deudas han sido pagadas</p>';
        estadoNFC.className = 'estado-nfc estado-exitoso';
    }
}

// Función para simular fallo en la conexión
function simularFalloConexion() {
    estadoNFC.innerHTML = '<p class="estado-error">No se pudo conectar con el dispositivo</p>';
    estadoNFC.className = 'estado-nfc estado-error';
}

// Función para actualizar la lista de deudas
function actualizarListaDeudas() {
    listaDeudas.innerHTML = '';
    
    deudas.forEach(deuda => {
        const elementoDeuda = document.createElement('div');
        elementoDeuda.className = 'item-deuda';
        
        if (deuda.pagado) {
            elementoDeuda.innerHTML = `
                <span>${deuda.persona}</span>
                <span class="deuda-pagada">Pagado ✓</span>
            `;
        } else {
            elementoDeuda.innerHTML = `
                <span>${deuda.persona}</span>
                <span class="deuda-pendiente">${deuda.monto.toFixed(2)}€</span>
            `;
        }
        
        listaDeudas.appendChild(elementoDeuda);
    });
}

// Función para actualizar el historial de pagos
function actualizarHistorialPagos() {
    listaPagos.innerHTML = '';
    
    if (pagosRealizados.length === 0) {
        listaPagos.innerHTML = '<p>No hay pagos registrados aún</p>';
        return;
    }
    
    // Mostrar los últimos pagos primero
    const pagosOrdenados = [...pagosRealizados].reverse();
    
    pagosOrdenados.forEach(pago => {
        const elementoPago = document.createElement('div');
        elementoPago.className = 'item-pago';
        elementoPago.innerHTML = `
            <div>
                <strong>${pago.persona}</strong>
                <div class="fecha-pago">${pago.fecha}</div>
            </div>
            <div>${pago.monto.toFixed(2)}€</div>
        `;
        
        listaPagos.appendChild(elementoPago);
    });
}

// Función para guardar datos en localStorage
function guardarDatos() {
    const datos = {
        deudas: deudas,
        pagosRealizados: pagosRealizados
    };
    
    localStorage.setItem('tricountDatos', JSON.stringify(datos));
}

// Función para cargar datos desde localStorage
function cargarDatosGuardados() {
    const datosGuardados = localStorage.getItem('tricountDatos');
    
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        deudas = datos.deudas || [];
        pagosRealizados = datos.pagosRealizados || [];
        
        // Si hay deudas, mostrar la sección de resultados
        if (deudas.length > 0) {
            seccionResultados.style.display = 'block';
            actualizarListaDeudas();
            
            // Actualizar montos mostrados
            const montoTotal = deudas.reduce((total, deuda) => total + deuda.monto, 0);
            totalMostrar.textContent = `${montoTotal.toFixed(2)}€`;
            cuotaMostrar.textContent = `${deudas[0].monto.toFixed(2)}€`;
        }
    }
}