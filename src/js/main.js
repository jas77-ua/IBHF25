/**
 * Punto de entrada principal de la aplicación Sabadell NEXT
 */

import { appState } from './state/appState.js';
import { TransactionService } from './services/transactionService.js';
import { Balance } from './components/Balance.js';
import { Missions } from './components/Missions.js';
import { Transactions } from './components/Transactions.js';

class App {
    constructor() {
        this.appState = appState;
        this.transactionService = new TransactionService(this.appState);

        // Componentes
        this.balanceComponent = null;
        this.missionsComponent = null;
        this.transactionsComponent = null;
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        // Crear componentes
        this.balanceComponent = new Balance(this.appState);
        this.missionsComponent = new Missions(this.appState);
        this.transactionsComponent = new Transactions(this.appState);

        // Configurar callback de misiones
        this.missionsComponent.setOnMissionClick((misionId) => {
            this.handleCompletarMision(misionId);
        });

        // Renderizar contenido inicial
        this.render();

        // Configurar navegación
        this.setupNavigation();

        // Configurar controles de demo
        this.setupDemoControls();

        // Suscribirse a cambios de estado
        this.appState.subscribe(() => this.render());

        console.log('🚀 Aplicación Sabadell NEXT iniciada correctamente');
    }

    /**
     * Renderiza todos los componentes
     */
    render() {
        this.balanceComponent.render();
        this.missionsComponent.render();
        this.transactionsComponent.render();
    }

    /**
     * Maneja la finalización de una misión
     */
    handleCompletarMision(misionId) {
        const mision = this.transactionService.completarMision(misionId);

        if (mision) {
            this.balanceComponent.animateSaldoChange();
            alert(`🎉 ¡Misión completada! Recompensa: ${mision.recompensa}`);
        }
    }

    /**
     * Configura la navegación inferior
     */
    setupNavigation() {
        const elementosNav = document.querySelectorAll('.elemento-nav');

        elementosNav.forEach(elemento => {
            elemento.addEventListener('click', (e) => {
                // Remover clase activo de todos
                elementosNav.forEach(nav => nav.classList.remove('activo'));

                // Añadir clase activo al clickeado
                e.currentTarget.classList.add('activo');

                // Obtener página
                const pagina = e.currentTarget.getAttribute('data-pagina');
                console.log(`Navegando a: ${pagina}`);

                // Aquí se podría implementar navegación real en el futuro
            });
        });
    }

    /**
     * Configura los controles de demostración
     */
    setupDemoControls() {
        // Botón añadir dinero
        const btnAñadirDinero = document.getElementById('añadir-dinero');
        if (btnAñadirDinero) {
            btnAñadirDinero.addEventListener('click', () => {
                this.transactionService.simularTransaccion(20, 'Paga extra');
                this.balanceComponent.animateSaldoChange();
            });
        }

        // Botón gastar dinero
        const btnGastarDinero = document.getElementById('gastar-dinero');
        if (btnGastarDinero) {
            btnGastarDinero.addEventListener('click', () => {
                this.transactionService.simularTransaccion(-15, 'Compra juegos');
                this.balanceComponent.animateSaldoChange();
            });
        }

        // Botón completar misión
        const btnCompletarMision = document.getElementById('completar-mision');
        if (btnCompletarMision) {
            btnCompletarMision.addEventListener('click', () => {
                const mision = this.transactionService.completarMisionAleatoria();

                if (mision) {
                    this.balanceComponent.animateSaldoChange();
                    alert(`🎉 ¡Misión completada! Recompensa: ${mision.recompensa}`);
                } else {
                    alert('¡Todas las misiones están completadas! 🏆');
                }
            });
        }

        // Botón reiniciar demo
        const btnReiniciarDemo = document.getElementById('reiniciar-demo');
        if (btnReiniciarDemo) {
            btnReiniciarDemo.addEventListener('click', () => {
                this.transactionService.reiniciarDemo();
                alert('Demo reiniciada 🔄');
            });
        }
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
