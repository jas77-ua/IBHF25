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
        this.seccionTarjetas = document.getElementById('seccion-tarjetas');
        this.historialContainer = document.getElementById('historial-tarjeta-contenedor');
        this.bannerTarjeta1 = document.getElementById('banner-tarjeta-1');
        this.bannerTarjeta2 = document.getElementById('banner-tarjeta-2');

        if (!this.eventListenersSetup) {
            this.setupEventListeners();
            this.eventListenersSetup = true;
        }
    }

    render() {
        // Inicializar si no se ha hecho
        if (!this.bannerTarjeta1 || !this.bannerTarjeta2) {
            this.init();
        }

        const { tarjetas } = this.appState.getState();

        // Actualizar banners con la información de las tarjetas
        tarjetas.forEach((tarjeta, index) => {
            const banner = document.querySelector(`#banner-tarjeta-${index + 1} .detalles-tarjeta`);
            if (banner) {
                const nombreElement = banner.querySelector('.nombre-tarjeta');
                const terminaElement = banner.querySelector('.termina-en');

                if (nombreElement) {
                    nombreElement.textContent = tarjeta.bloqueada ? 'Tarjeta Bloqueada 🔒' : tarjeta.nombre;
                }
                if (terminaElement) {
                    terminaElement.textContent = `Termina en ${tarjeta.numero.slice(-4)}`;
                }
            }
        });

        // Actualizar todas las tarjetas en la vista detalle
        tarjetas.forEach((tarjeta, index) => {
            const tarjetaElement = document.getElementById(`tarjeta-${index + 1}`);
            if (!tarjetaElement) return;

            // Actualizar número de tarjeta
            const ultimosDigitos = tarjetaElement.querySelector('.ultimos-digitos-tarjeta');
            if (ultimosDigitos) {
                ultimosDigitos.textContent = tarjeta.numero.slice(-4);
            }

            // Actualizar titular
            const titular = tarjetaElement.querySelector('.tarjeta-titular');
            if (titular) {
                titular.textContent = tarjeta.titular || '—';
            }

            // Actualizar botones según estado
            const btnBloquear = tarjetaElement.querySelector('.boton-bloquear');
            const btnDesbloquear = tarjetaElement.querySelector('.boton-desbloquear');
            if (btnBloquear && btnDesbloquear) {
                btnBloquear.style.display = tarjeta.bloqueada ? 'none' : '';
                btnDesbloquear.style.display = tarjeta.bloqueada ? '' : 'none';
            }

            // Actualizar clase de tipo de tarjeta
            const tarjetaBancaria = tarjetaElement.querySelector('.tarjeta-bancaria');
            if (tarjetaBancaria) {
                if (tarjeta.tipo === 'Prepago') {
                    tarjetaBancaria.classList.add('tarjeta-prepago');
                } else {
                    tarjetaBancaria.classList.remove('tarjeta-prepago');
                }
            }
        });
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

        // Banners → navegar a tarjetas y mostrar la específica
        const setupBannerListener = (banner, index) => {
            if (banner) {
                banner.addEventListener('click', () => {
                    if (this.navegarCallback) {
                        this.navegarCallback('tarjetas');
                        this.mostrarTarjetaEspecifica(index);
                    }
                });
            }
        };
        setupBannerListener(this.bannerTarjeta1, 0);
        setupBannerListener(this.bannerTarjeta2, 1);

        // Botón volver de tarjetas → inicio
        document.getElementById('boton-volver-tarjetas')?.addEventListener('click', () => {
            if (this.navegarCallback) this.navegarCallback('inicio');
        });

        // Botón volver del historial
        document.getElementById('boton-volver-historial')?.addEventListener('click', () => 
            this.volverDeHistorial()
        );

        // Configurar listeners para cada tarjeta
        const { tarjetas } = this.appState.getState();
        tarjetas.forEach((_, index) => {
            const tarjetaElement = document.getElementById(`tarjeta-${index + 1}`);
            if (!tarjetaElement) return;

            // Bloquear/Desbloquear usando tus métodos con alertas
            tarjetaElement.querySelector('.boton-bloquear')?.addEventListener('click', () => 
                this.bloquearTarjeta(index)
            );
            tarjetaElement.querySelector('.boton-desbloquear')?.addEventListener('click', () => 
                this.desbloquearTarjeta(index)
            );

            // Historial
            tarjetaElement.querySelector('.boton-historial')?.addEventListener('click', () => {
                const historialContainer = document.getElementById('historial-tarjeta-contenedor');
                if (historialContainer) {
                    historialContainer.style.display = 'block';
                    this.renderHistorial();
                }
            });
        });
    }

    mostrarSeccionTarjetas() {
        document.querySelector('.banners-tarjetas').style.display = 'none';
        this.seccionTarjetas.style.display = 'block';
        document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
        // Aseguramos que los detalles de las tarjetas estén visibles y el historial oculto
        document.querySelectorAll('.tarjeta-detalle').forEach(t => t.style.display = 'block');
        this.historialContainer.style.display = 'none';
    }

    mostrarTarjetaEspecifica(index) {
        // Ocultar todas las tarjetas primero
        document.querySelectorAll('.tarjeta-detalle').forEach(t => t.style.display = 'none');
        
        // Mostrar solo la tarjeta seleccionada
        const tarjetaSeleccionada = document.getElementById(`tarjeta-${index + 1}`);
        if (tarjetaSeleccionada) {
            tarjetaSeleccionada.style.display = 'block';
        }
        
        this.historialContainer.style.display = 'none';
    }

    mostrarInicio() {
        document.querySelector('.banners-tarjetas').style.display = '';
        this.seccionTarjetas.style.display = 'none';
        document.querySelectorAll('.seccion').forEach(s => s.style.display = '');
        this.historialContainer.style.display = 'none';
        // Reseteamos el estado de la vista de tarjetas
        document.querySelectorAll('.tarjeta-detalle').forEach(t => t.style.display = 'block');
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

   bloquearTarjeta(index) {
        const { tarjetas } = this.appState.getState();
        const tarjeta = tarjetas[index];

        if (!tarjeta) return; // Seguridad por si no existe

        if (tarjeta.bloqueada) {
            alert(`⚠️ La ${tarjeta.nombre} ya está bloqueada.`);
            return;
        }

        if (confirm('¿Seguro que quieres bloquear tu tarjeta?\n\nNo podrás hacer pagos hasta que la desbloquees.')) {
            // Creamos un nuevo array de tarjetas con la tarjeta bloqueada
            const nuevasTarjetas = tarjetas.map((t, i) =>
                i === index ? { ...t, bloqueada: true } : t
            );

            // Actualizamos el estado completo
            this.appState.updateTarjetas(nuevasTarjetas);

            alert('✅ Tarjeta bloqueada con éxito.\nContacta con soporte para desbloquearla.');

            // Volver a inicio usando el callback de navegación
            if (this.navegarCallback) {
                setTimeout(() => this.navegarCallback('inicio'), 1000);
            }
        }
    }

    desbloquearTarjeta(index) {
    const { tarjetas } = this.appState.getState();
    const tarjeta = tarjetas[index];
    
    if (!tarjeta) return;

    if (!tarjeta.bloqueada) {
        alert(`ℹ️ La ${tarjeta.nombre} ya está activa.`);
        return;
    }

    if (confirm('¿Seguro que quieres desbloquear tu tarjeta?')) {
        // Crea un nuevo array con la tarjeta desbloqueada
        const nuevasTarjetas = tarjetas.map((t, i) =>
            i === index ? { ...t, bloqueada: false } : t
        );

        // Actualiza el estado completo (igual que en bloquearTarjeta)
        this.appState.updateTarjetas(nuevasTarjetas);

        alert('✅ Tarjeta desbloqueada con éxito.');
        if (this.navegarCallback) {
            setTimeout(() => this.navegarCallback('inicio'), 1000);
        }
    }
}
}