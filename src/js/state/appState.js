/**
 * Gestión centralizada del estado de la aplicación
 */

import { initialState } from '../data/initialState.js';

class AppState {
    constructor() {
        this.state = { ...initialState };
        this.listeners = [];
    }

    /**
     * Obtiene el estado actual
     */
    getState() {
        return this.state;
    }

    /**
     * Actualiza el estado y notifica a los listeners
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    /**
     * Actualiza el saldo
     */
    updateSaldo(nuevoSaldo) {
        this.setState({ saldo: nuevoSaldo });
    }

    /**
     * Añade una transacción
     */
    addTransaccion(transaccion) {
        const transacciones = [transaccion, ...this.state.transacciones];
        this.setState({ transacciones });
    }

    /**
     * Actualiza una misión
     */
    updateMision(idMision, cambios) {
        const misiones = this.state.misiones.map(mision =>
            mision.id === idMision ? { ...mision, ...cambios } : mision
        );
        this.setState({ misiones });
    }

    /**
     * Obtiene una misión por ID
     */
    getMision(idMision) {
        return this.state.misiones.find(m => m.id === idMision);
    }

    /**
     * Obtiene misiones no completadas
     */
    getMisionesIncompletas() {
        return this.state.misiones.filter(m => !m.completada);
    }

    /**
     * Actualiza el estado de las tarjetas
     */
    updateTarjetas(tarjetas) {
        this.setState({ tarjetas });
    }

    /**
     * Reinicia el estado a los valores iniciales
     */
    reset() {
        this.state = JSON.parse(JSON.stringify(initialState));
        this.notifyListeners();
    }

    /**
     * Suscribe un listener para cambios de estado
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notifica a todos los listeners
     */
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Singleton: exportamos una única instancia
export const appState = new AppState();
