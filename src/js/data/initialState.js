/**
 * Estado inicial de la aplicación
 */

import { APP_CONFIG, TIPOS_TRANSACCION } from '../config/constants.js';

export const initialState = {
    saldo: APP_CONFIG.SALDO_INICIAL,
    metaAhorro: APP_CONFIG.META_AHORRO_DEFAULT,
    
    tarjetas: [
        {
            id: 1,
            nombre: "Tarjeta Sabadell First",
            numero: "4532123456784321",
            bloqueada: false,
            titular: "ALEX MARTÍNEZ", // Nombre por defecto, se actualizará con el perfil
            tipo: "Débito"
        },
        {
            id: 2,
            nombre: "Tarjeta Sabadell Young",
            numero: "4532987654321",
            bloqueada: false,
            titular: "ALEX MARTÍNEZ", // Nombre por defecto, se actualizará con el perfil
            tipo: "Prepago"
        }
    ],

    misiones: [
        {
            id: 1,
            titulo: "Primer Ahorro Épico",
            icono: "fi-rr-piggy-bank",
            descripcion: "Ahorra €50 este mes y gana recompensas especiales",
            recompensa: "+€5 bonus + Insignia",
            completada: false,
            progreso: 65
        },
        {
            id: 2,
            titulo: "Cazador de Estafas",
            icono: "fi-rr-shield-check",
            descripcion: "Aprende a identificar 3 casos de phishing reales",
            recompensa: "Avatar Exclusivo",
            completada: false,
            progreso: 30
        },
        {
            id: 3,
            titulo: "Inversor Novato",
            icono: "fi-rr-chart-line-up",
            descripcion: "Simula una inversión de €1000 en bolsa virtual",
            recompensa: "Desbloqueo Simulador Avanzado",
            completada: false,
            progreso: 10
        }
    ],

    transacciones: [
        {
            id: 1,
            nombre: "Paga Extra Papás",
            cantidad: 20,
            fecha: "Hoy, 10:30",
            tipo: TIPOS_TRANSACCION.POSITIVO
        },
        {
            id: 2,
            nombre: "Steam - Videojuego",
            cantidad: 29.99,
            fecha: "Ayer, 16:45",
            tipo: TIPOS_TRANSACCION.NEGATIVO
        },
        {
            id: 3,
            nombre: "Ahorro Automático",
            cantidad: 10,
            fecha: "11 Oct, 08:00",
            tipo: TIPOS_TRANSACCION.POSITIVO
        },
        {
            id: 4,
            nombre: "McDonald's",
            cantidad: 12.50,
            fecha: "14 Oct, 19:20",
            tipo: TIPOS_TRANSACCION.NEGATIVO
        }
    ]
};
