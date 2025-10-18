/**
 * Componente de Tarjeta
 */
export class Card {
    constructor(appState, navegarCallback) {
        this.appState = appState;
        this.navegarCallback = navegarCallback; // Callback para navegar entre vistas
        this.bannerTarjeta = null;
        this.seccionTarjetas = null;
        this.historialContainer = null;
        this.eventListenersSetup = false;
    }

    /**
     * Inicializa el componente (se llama después de que el DOM esté listo)
     */
    init() {
        this.bannerTarjeta = document.getElementById('banner-tarjeta');
        this.seccionTarjetas = document.getElementById('seccion-tarjetas');
        this.historialContainer = document.getElementById('historial-tarjeta-contenedor');

        if (!this.eventListenersSetup) {
            this.setupEventListeners();
            this.eventListenersSetup = true;
        }
    }

    render() {
        // Inicializar si no se ha hecho
        if (!this.bannerTarjeta) {
            this.init();
        }

        const { tarjeta } = this.appState.getState();

        // Actualizar banner
        const nombreTarjeta = document.getElementById('nombre-tarjeta');
        const terminaEn = document.getElementById('termina-en');

        if (nombreTarjeta) {
            nombreTarjeta.textContent = tarjeta.bloqueada ? 'Tarjeta Bloqueada 🔒' : tarjeta.nombre;
        }
        if (terminaEn) {
            terminaEn.textContent = `Termina en ${tarjeta.numero.slice(-4)}`;
        }

        // Actualizar vista detalle
        const ultimosDigitos = document.getElementById('ultimos-digitos-tarjeta');
        if (ultimosDigitos) {
            ultimosDigitos.textContent = tarjeta.numero.slice(-4);
        }

        // Actualizar botones según estado
        const btnBloquear = document.getElementById('bloquear-tarjeta');
        const btnDesbloquear = document.getElementById('desbloquear-tarjeta');
        if (btnBloquear && btnDesbloquear) {
            btnBloquear.style.display = tarjeta.bloqueada ? 'none' : '';
            btnDesbloquear.style.display = tarjeta.bloqueada ? '' : 'none';
        }
    }

    renderHistorial() {
        const { transacciones } = this.appState.getState();
        const contenedor = document.getElementById('lista-historial-tarjeta');
        if (!contenedor) return;

        contenedor.innerHTML = transacciones.map(transaccion => `
            <div class="elemento-historial">
                <div>
                    <div class="nombre-historial">${transaccion.nombre}</div>
                    <div class="fecha-historial">${transaccion.fecha}</div>
                </div>
                <div class="cantidad-historial ${transaccion.tipo}">
                    ${transaccion.tipo === 'positivo' ? '+' : '-'}€${transaccion.cantidad.toFixed(2)}
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        console.log('🎴 Configurando event listeners de Card...');
        console.log('Banner tarjeta encontrado:', this.bannerTarjeta ? '✅' : '❌');
        console.log('Callback de navegación:', this.navegarCallback ? '✅' : '❌');

        // Click en banner de tarjeta - navega a vista de tarjetas
        if (this.bannerTarjeta) {
            this.bannerTarjeta.addEventListener('click', () => {
                console.log('🖱️ Click en banner de tarjeta detectado');
                if (this.navegarCallback) {
                    console.log('📱 Navegando a vista de tarjetas...');
                    this.navegarCallback('tarjetas');
                } else {
                    console.error('❌ No hay callback de navegación disponible');
                }
            });
            console.log('✅ Event listener del banner configurado correctamente');
        } else {
            console.error('❌ No se encontró el elemento banner-tarjeta');
        }

        // Bloquear tarjeta
        const btnBloquear = document.getElementById('bloquear-tarjeta');
        if (btnBloquear) {
            btnBloquear.addEventListener('click', () => this.bloquearTarjeta());
        }

        // Desbloquear tarjeta
        const btnDesbloquear = document.getElementById('desbloquear-tarjeta');
        if (btnDesbloquear) {
            btnDesbloquear.addEventListener('click', () => this.desbloquearTarjeta());
        }

        // Ver historial
        const btnHistorial = document.getElementById('historial-tarjeta');
        if (btnHistorial) {
            btnHistorial.addEventListener('click', () => {
                this.mostrarHistorial();
                this.renderHistorial();
            });
        }

        // Volver del historial
        const btnVolverHistorial = document.getElementById('boton-volver-historial');
        if (btnVolverHistorial) {
            btnVolverHistorial.addEventListener('click', () => this.volverDeHistorial());
        }
    }

    mostrarHistorial() {
        this.historialContainer.style.display = 'block';
        const tarjetaDetalle = document.querySelector('.tarjeta-detalle');
        if (tarjetaDetalle) {
            tarjetaDetalle.style.display = 'none';
        }
    }

    volverDeHistorial() {
        this.historialContainer.style.display = 'none';
        const tarjetaDetalle = document.querySelector('.tarjeta-detalle');
        if (tarjetaDetalle) {
            tarjetaDetalle.style.display = 'block';
        }
    }

    bloquearTarjeta() {
        const { tarjeta } = this.appState.getState();
        if (tarjeta.bloqueada) {
            alert('⚠️ Esta tarjeta ya está bloqueada.');
            return;
        }

        if (confirm('¿Seguro que quieres bloquear tu tarjeta?\n\nNo podrás hacer pagos hasta que la desbloquees.')) {
            this.appState.updateTarjeta({ ...tarjeta, bloqueada: true });
            alert('✅ Tarjeta bloqueada con éxito.\nContacta con soporte para desbloquearla.');
            // Volver a inicio usando el callback de navegación
            if (this.navegarCallback) {
                setTimeout(() => this.navegarCallback('inicio'), 1000);
            }
        }
    }

    desbloquearTarjeta() {
        const { tarjeta } = this.appState.getState();
        if (!tarjeta.bloqueada) {
            alert('ℹ️ La tarjeta ya está activa.');
            return;
        }

        if (confirm('¿Seguro que quieres desbloquear tu tarjeta?')) {
            this.appState.updateTarjeta({ ...tarjeta, bloqueada: false });
            alert('✅ Tarjeta desbloqueada con éxito.');
            // Volver a inicio usando el callback de navegación
            if (this.navegarCallback) {
                setTimeout(() => this.navegarCallback('inicio'), 1000);
            }
        }
    }
}