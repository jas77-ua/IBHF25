/**
 * Componente de Reloj
 */

import { APP_CONFIG } from '../config/constants.js';

export class Clock {
    constructor() {
        this.elemento = document.getElementById('hora-actual');
        this.intervalId = null;
    }

    /**
     * Actualiza la hora mostrada
     */
    update() {
        const ahora = new Date();
        const textoHora = ahora.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        this.elemento.textContent = textoHora;
    }

    /**
     * Inicia el reloj con actualización periódica
     */
    start() {
        this.update();
        this.intervalId = setInterval(
            () => this.update(),
            APP_CONFIG.ACTUALIZACION_RELOJ_MS
        );
    }

    /**
     * Detiene el reloj
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
