/**
 * Punto de entrada principal de la aplicación Sabadell NEXT
 */

import { appState } from './state/appState.js';
import { TransactionService } from './services/transactionService.js';
import { Balance } from './components/Balance.js';
import { Missions } from './components/Missions.js';
import { Transactions } from './components/Transactions.js';
import { Card } from './components/Card.js';

class App {
    constructor() {
        this.appState = appState;
        this.transactionService = new TransactionService(this.appState);

        // Componentes
        this.balanceComponent = null;
        this.missionsComponent = null;
        this.transactionsComponent = null;
        this.cardComponent = null;

        // Elementos del perfil
        this.perfilOverlay = document.getElementById('pagina-perfil');
        this.inputNombre = document.getElementById('perfil-nombre');
        this.inputEmail = document.getElementById('perfil-email');
        this.inputAvatarUrl = document.getElementById('perfil-avatar-url');
        this.imgAvatar = document.getElementById('perfil-avatar');
        
        this.PERFIL_KEY = 'app_perfil_v1';
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        // Crear componentes
        this.balanceComponent = new Balance(this.appState);
        this.missionsComponent = new Missions(this.appState);
        this.transactionsComponent = new Transactions(this.appState);
        this.cardComponent = new Card(this.appState);

        // Configurar callback de misiones
        this.missionsComponent.setOnMissionClick((misionId) => {
            this.handleCompletarMision(misionId);
        });

        // Configurar navegación
        this.setupNavigation();

        // Configurar eventos del perfil
        this.setupPerfilEvents();

        // Renderizar contenido inicial
        this.render();

        // Suscribirse a cambios de estado
        this.appState.subscribe(() => this.render());

        // Cargar datos del perfil
        this.cargarPerfilInicial();

        console.log('🚀 Aplicación Sabadell NEXT iniciada correctamente');
    }

    /**
     * Renderiza todos los componentes
     */
    render() {
        this.balanceComponent.render();
        this.missionsComponent.render();
        this.transactionsComponent.render();
        this.cardComponent.render();
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
        // Remover clase activo de todos los elementos de navegación
        document.querySelectorAll('.elemento-nav').forEach(nav => nav.classList.remove('activo'));
        document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('activo'));
        
        // Añadir clase activo al elemento correspondiente
        document.querySelectorAll(`[data-pagina="${pagina}"]`).forEach(el => {
            el.classList.add('activo');
        });

        switch(pagina) {
            case 'inicio':
                console.log('Navegando a página de inicio');
                // Ocultar perfil si está abierto
                this.cerrarPerfilOverlay();
                break;
            case 'misiones':
                console.log('Navegando a página de misiones');
                this.cerrarPerfilOverlay();
                break;
            case 'touch-share':
                // Navegar a la página de Touch & Share
                this.navegarATouchShare();
                break;
            case 'estadisticas':
                console.log('Navegando a página de estadísticas');
                this.cerrarPerfilOverlay();
                break;
            case 'perfil':
                console.log('Navegando a página de perfil');
                // Abrir el overlay de perfil
                this.abrirPerfil();
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

    /**
     * Configura los eventos del perfil
     */
    setupPerfilEvents() {
        const cerrarPerfil = document.getElementById('cerrar-perfil');
        const cerrarPerfil2 = document.getElementById('cerrar-perfil-2');
        const guardarPerfilBtn = document.getElementById('guardar-perfil');
        const logoutBtn = document.getElementById('logout-btn');

        if (cerrarPerfil) {
            cerrarPerfil.addEventListener('click', () => this.cerrarPerfilOverlay());
        }
        if (cerrarPerfil2) {
            cerrarPerfil2.addEventListener('click', () => this.cerrarPerfilOverlay());
        }
        if (guardarPerfilBtn) {
            guardarPerfilBtn.addEventListener('click', () => this.guardarPerfil());
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Actualizar avatar en tiempo real
        if (this.inputAvatarUrl) {
            this.inputAvatarUrl.addEventListener('input', (e) => {
                this.imgAvatar.src = e.target.value || '../src/assets/perfil.jpg';
            });
        }
    }

    /**
     * Abre el overlay del perfil
     */
    abrirPerfil() {
        const datos = JSON.parse(localStorage.getItem(this.PERFIL_KEY) || '{}');
        this.inputNombre.value = datos.nombre || 'Alex';
        this.inputEmail.value = datos.email || 'alex@ejemplo.com';
        this.inputAvatarUrl.value = datos.avatar || '../src/assets/perfil.jpg';
        this.imgAvatar.src = this.inputAvatarUrl.value;
        this.perfilOverlay.style.display = 'flex';
    }

    /**
     * Cierra el overlay del perfil
     */
    cerrarPerfilOverlay() {
        this.perfilOverlay.style.display = 'none';
    }

    /**
     * Guarda los datos del perfil
     */
    guardarPerfil() {
        const datos = {
            nombre: this.inputNombre.value.trim() || 'Alex',
            email: this.inputEmail.value.trim() || '',
            avatar: this.inputAvatarUrl.value.trim() || '../src/assets/perfil.jpg'
        };
        localStorage.setItem(this.PERFIL_KEY, JSON.stringify(datos));
        this.imgAvatar.src = datos.avatar;
        this.actualizarBienvenida(datos.nombre);

        // Actualizar el nombre en la tarjeta
        const { tarjeta } = this.appState.getState();
        this.appState.updateTarjeta({
            ...tarjeta,
            titular: datos.nombre.toUpperCase()
        });
        
        this.cerrarPerfilOverlay();
    }

    /**
     * Actualiza el mensaje de bienvenida
     */
    actualizarBienvenida(nombre) {
        const textoBienvenida = document.querySelector('.texto-bienvenida');
        if (textoBienvenida) {
            textoBienvenida.innerHTML = `¡Hola, ${nombre}! <i class="fi fi-rr-hand-wave"></i>`;
        }
    }

    /**
     * Cierra sesión
     */
    logout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            localStorage.removeItem(this.PERFIL_KEY);
            window.location.href = '../src/index/login.html';
        }
    }

    /**
     * Carga los datos iniciales del perfil
     */
    cargarPerfilInicial() {
        const datos = JSON.parse(localStorage.getItem(this.PERFIL_KEY) || '{}');
        if (datos.nombre) {
            this.actualizarBienvenida(datos.nombre);
            
            // Actualizar el nombre en la tarjeta
            const { tarjeta } = this.appState.getState();
            this.appState.updateTarjeta({
                ...tarjeta,
                titular: datos.nombre.toUpperCase()
            });
        }
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});