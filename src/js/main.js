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

                // Manejar navegación específica
                this.navegarAPagina(pagina);
            });
        });
    }

    /**
     * Maneja la navegación entre páginas
     */
    navegarAPagina(pagina) {
        switch(pagina) {
            case 'inicio':
                // Ya estamos en inicio
                console.log('Navegando a página de inicio');
                break;
            case 'misiones':
                // Aquí puedes implementar navegación a misiones
                console.log('Navegando a página de misiones');
                break;
            case 'touch-share':
                // Navegar a la página de Touch & Share
                this.navegarATouchShare();
                break;
            case 'estadisticas':
                // Aquí puedes implementar navegación a estadísticas
                console.log('Navegando a página de estadísticas');
                break;
            case 'perfil':
                // Aquí puedes implementar navegación a perfil
                console.log('Navegando a página de perfil');
                break;
            default:
                console.log('Página no reconocida:', pagina);
        }
    }

    /**
     * Navega a la página de Touch & Share
     */
    navegarATouchShare() {
        // CAMBIA ESTA URL POR LA QUE TÚ QUIERAS
        const urlTouchShare = '../src/index/touch_share.html'; 
        
        // Redirigir a la página
        window.location.href = urlTouchShare;
        
        console.log('🔗 Navegando a Touch & Share:', urlTouchShare);
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});