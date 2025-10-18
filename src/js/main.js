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
        const menuItems = document.querySelectorAll('.menu-item');

        // Navegación inferior (desktop)
        elementosNav.forEach(elemento => {
            elemento.addEventListener('click', (e) => {
                // Remover clase activo de todos
                elementosNav.forEach(nav => nav.classList.remove('activo'));
                menuItems.forEach(item => item.classList.remove('activo'));

                // Añadir clase activo al clickeado
                e.currentTarget.classList.add('activo');

                // Obtener página
                const pagina = e.currentTarget.getAttribute('data-pagina');
                console.log(`Navegando a: ${pagina}`);

                // Manejar navegación específica
                this.navegarAPagina(pagina);
            });
        });

        // Navegación menú lateral (móvil)
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                // Remover clase activo de todos
                menuItems.forEach(mi => mi.classList.remove('activo'));
                elementosNav.forEach(nav => nav.classList.remove('activo'));

                // Añadir clase activo al clickeado
                e.currentTarget.classList.add('activo');

                // Obtener página
                const pagina = e.currentTarget.getAttribute('data-pagina');
                console.log(`Navegando a: ${pagina}`);

                // Cerrar menú móvil
                this.cerrarMenuMovil();

                // Manejar navegación específica
                this.navegarAPagina(pagina);
            });
        });

        // Configurar menú hamburguesa
        this.setupHamburgerMenu();
    }

    /**
     * Configura el menú hamburguesa para móviles
     */
    setupHamburgerMenu() {
        const botonHamburguesa = document.getElementById('boton-hamburguesa');
        const botonCerrar = document.getElementById('boton-cerrar-menu');
        const menuLateral = document.getElementById('menu-lateral');
        const menuOverlay = document.getElementById('menu-overlay');

        if (!botonHamburguesa || !menuLateral || !menuOverlay) return;

        // Abrir menú
        botonHamburguesa.addEventListener('click', () => {
            this.abrirMenuMovil();
        });

        // Cerrar menú con botón X
        if (botonCerrar) {
            botonCerrar.addEventListener('click', () => {
                this.cerrarMenuMovil();
            });
        }

        // Cerrar menú con overlay
        menuOverlay.addEventListener('click', () => {
            this.cerrarMenuMovil();
        });
    }

    /**
     * Abre el menú móvil
     */
    abrirMenuMovil() {
        const botonHamburguesa = document.getElementById('boton-hamburguesa');
        const menuLateral = document.getElementById('menu-lateral');
        const menuOverlay = document.getElementById('menu-overlay');

        botonHamburguesa.classList.add('activo');
        menuLateral.classList.add('abierto');
        menuOverlay.classList.add('visible');

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cierra el menú móvil
     */
    cerrarMenuMovil() {
        const botonHamburguesa = document.getElementById('boton-hamburguesa');
        const menuLateral = document.getElementById('menu-lateral');
        const menuOverlay = document.getElementById('menu-overlay');

        botonHamburguesa.classList.remove('activo');
        menuLateral.classList.remove('abierto');
        menuOverlay.classList.remove('visible');

        // Restaurar scroll del body
        document.body.style.overflow = '';
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