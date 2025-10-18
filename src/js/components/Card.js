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
        const { tarjetas } = this.appState.getState();
        
        // Actualizar banner (mostramos la primera tarjeta en el banner)
        const tarjetaPrincipal = tarjetas[0];
        document.getElementById('nombre-tarjeta').textContent = tarjetaPrincipal.bloqueada ? 
            'Tarjeta Bloqueada 🔒' : tarjetaPrincipal.nombre;
        document.getElementById('termina-en').textContent = `Termina en ${tarjetaPrincipal.numero.slice(-4)}`;
        
        // Actualizar cada tarjeta
        tarjetas.forEach((tarjeta, index) => {
            const num = index + 1;
            // Actualizar detalles de la tarjeta
            document.getElementById(`ultimos-digitos-tarjeta-${num}`).textContent = tarjeta.numero.slice(-4);
            document.getElementById(`tarjeta-titular-${num}`).textContent = tarjeta.titular || '—';
            
            // Actualizar botones según estado
            const btnBloquear = document.getElementById(`bloquear-tarjeta-${num}`);
            const btnDesbloquear = document.getElementById(`desbloquear-tarjeta-${num}`);
            if (btnBloquear && btnDesbloquear) {
                btnBloquear.style.display = tarjeta.bloqueada ? 'none' : '';
                btnDesbloquear.style.display = tarjeta.bloqueada ? '' : 'none';
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
        // Click en banner de tarjeta
        this.bannerTarjeta?.addEventListener('click', () => this.mostrarSeccionTarjetas());

        // Botón volver desde tarjetas
        document.getElementById('boton-volver-tarjetas')?.addEventListener('click', () => 
            this.mostrarInicio());

        // Configurar listeners para cada tarjeta
        [1, 2].forEach(num => {
            // Bloquear tarjeta
            document.getElementById(`bloquear-tarjeta-${num}`)?.addEventListener('click', () => 
                this.bloquearTarjeta(num - 1));

            // Desbloquear tarjeta
            document.getElementById(`desbloquear-tarjeta-${num}`)?.addEventListener('click', () => 
                this.desbloquearTarjeta(num - 1));

            // Ver historial
            document.getElementById(`historial-tarjeta-${num}`)?.addEventListener('click', () => {
                this.mostrarHistorial();
                this.renderHistorial(num - 1);
            });
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

    bloquearTarjeta(index) {
        const { tarjetas } = this.appState.getState();
        const tarjeta = tarjetas[index];
        
        if (tarjeta.bloqueada) {
            alert(`⚠️ La ${tarjeta.nombre} ya está bloqueada.`);
            return;
        }

        if (confirm(`¿Seguro que quieres bloquear tu ${tarjeta.nombre}?\n\nNo podrás hacer pagos hasta que la desbloquees.`)) {
            const nuevasTarjetas = [...tarjetas];
            nuevasTarjetas[index] = { ...tarjeta, bloqueada: true };
            this.appState.updateTarjetas(nuevasTarjetas);
            alert(`✅ ${tarjeta.nombre} bloqueada con éxito.\nContacta con soporte para desbloquearla.`);
            setTimeout(() => this.mostrarInicio(), 1000);
        }
    }

    desbloquearTarjeta(index) {
        const { tarjetas } = this.appState.getState();
        const tarjeta = tarjetas[index];
        
        if (!tarjeta.bloqueada) {
            alert(`ℹ️ La ${tarjeta.nombre} ya está activa.`);
            return;
        }

        if (confirm(`¿Seguro que quieres desbloquear tu ${tarjeta.nombre}?`)) {
            const nuevasTarjetas = [...tarjetas];
            nuevasTarjetas[index] = { ...tarjeta, bloqueada: false };
            this.appState.updateTarjetas(nuevasTarjetas);
            alert(`✅ ${tarjeta.nombre} desbloqueada con éxito.`);
            setTimeout(() => this.mostrarInicio(), 1000);
        }
    }
}