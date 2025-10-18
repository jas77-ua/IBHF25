/**
 * Componente de Tarjeta
 */
export class Card {
    constructor(appState) {
        this.appState = appState;
        this.bannerTarjeta = document.getElementById('banner-tarjeta');
        this.seccionTarjetas = document.getElementById('seccion-tarjetas');
        this.historialContainer = document.getElementById('historial-tarjeta-contenedor');
        this.setupEventListeners();
    }

    render() {
        const { tarjeta } = this.appState.getState();
        
        // Actualizar banner
        document.getElementById('nombre-tarjeta').textContent = tarjeta.bloqueada ? 
            'Tarjeta Bloqueada 🔒' : tarjeta.nombre;
        document.getElementById('termina-en').textContent = `Termina en ${tarjeta.numero.slice(-4)}`;
        
        // Actualizar vista detalle
        document.getElementById('ultimos-digitos-tarjeta').textContent = tarjeta.numero.slice(-4);
        document.getElementById('tarjeta-titular').textContent = tarjeta.titular || '—';
        
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
        // Click en banner de tarjeta
        this.bannerTarjeta?.addEventListener('click', () => this.mostrarSeccionTarjetas());

        // Botón volver desde tarjetas
        document.getElementById('boton-volver-tarjetas')?.addEventListener('click', () => 
            this.mostrarInicio());

        // Bloquear tarjeta
        document.getElementById('bloquear-tarjeta')?.addEventListener('click', () => 
            this.bloquearTarjeta());

        // Desbloquear tarjeta
        document.getElementById('desbloquear-tarjeta')?.addEventListener('click', () => 
            this.desbloquearTarjeta());

        // Ver historial
        document.getElementById('historial-tarjeta')?.addEventListener('click', () => {
            this.mostrarHistorial();
            this.renderHistorial();
        });

        // Volver del historial
        document.getElementById('boton-volver-historial')?.addEventListener('click', () => 
            this.volverDeHistorial());
    }

    mostrarSeccionTarjetas() {
        this.bannerTarjeta.style.display = 'none';
        this.seccionTarjetas.style.display = 'block';
        document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
        // Aseguramos que el detalle de la tarjeta esté visible y el historial oculto
        document.querySelector('.tarjeta-detalle').style.display = 'block';
        this.historialContainer.style.display = 'none';
    }

    mostrarInicio() {
        this.bannerTarjeta.style.display = '';
        this.seccionTarjetas.style.display = 'none';
        document.querySelectorAll('.seccion').forEach(s => s.style.display = '');
        this.historialContainer.style.display = 'none';
        // Reseteamos el estado de la vista de tarjeta
        document.querySelector('.tarjeta-detalle').style.display = 'block';
    }

    mostrarHistorial() {
        this.historialContainer.style.display = 'block';
        document.querySelector('.tarjeta-detalle').style.display = 'none';
    }

    volverDeHistorial() {
        this.historialContainer.style.display = 'none';
        document.querySelector('.tarjeta-detalle').style.display = 'block';
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
            setTimeout(() => this.mostrarInicio(), 1000);
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
            setTimeout(() => this.mostrarInicio(), 1000);
        }
    }
}