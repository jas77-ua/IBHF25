/**
 * Servicio de Transacciones
 * Contiene la lógica de negocio relacionada con transacciones y misiones
 */

import { TIPOS_TRANSACCION } from '../config/constants.js';

export class TransactionService {
    constructor(appState) {
        this.appState = appState;
    }

    /**
     * Simula una transacción (ingreso o gasto)
     */
    simularTransaccion(cantidad, descripcion) {
        const state = this.appState.getState();
        const nuevoSaldo = state.saldo + cantidad;

        // Actualizar saldo
        this.appState.updateSaldo(nuevoSaldo);

        // Crear nueva transacción
        const nuevaTransaccion = {
            id: state.transacciones.length + 1,
            nombre: descripcion,
            cantidad: Math.abs(cantidad),
            fecha: 'Ahora mismo',
            tipo: cantidad > 0 ? TIPOS_TRANSACCION.POSITIVO : TIPOS_TRANSACCION.NEGATIVO
        };

        // Añadir transacción al estado
        this.appState.addTransaccion(nuevaTransaccion);

        return nuevaTransaccion;
    }

    /**
     * Completa una misión
     */
    completarMision(idMision) {
        const mision = this.appState.getMision(idMision);

        if (!mision || mision.completada) {
            return null;
        }

        // Marcar misión como completada
        this.appState.updateMision(idMision, {
            completada: true,
            progreso: 100
        });

        // Procesar recompensa económica si existe
        if (mision.recompensa.includes('+€')) {
            const coincidenciaRecompensa = mision.recompensa.match(/\+€(\d+)/);
            if (coincidenciaRecompensa) {
                const cantidadRecompensa = parseInt(coincidenciaRecompensa[1]);
                this.simularTransaccion(cantidadRecompensa, `Recompensa: ${mision.titulo}`);
            }
        }

        return mision;
    }

    /**
     * Completa una misión aleatoria de las incompletas
     */
    completarMisionAleatoria() {
        const misionesIncompletas = this.appState.getMisionesIncompletas();

        if (misionesIncompletas.length === 0) {
            return null;
        }

        const indiceAleatorio = Math.floor(Math.random() * misionesIncompletas.length);
        const misionAleatoria = misionesIncompletas[indiceAleatorio];

        return this.completarMision(misionAleatoria.id);
    }

    /**
     * Reinicia la demo al estado inicial
     */
    reiniciarDemo() {
        this.appState.reset();
    }
}
