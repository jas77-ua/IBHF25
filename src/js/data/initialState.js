/**
 * Estado inicial de la aplicación
 */

import { APP_CONFIG, TIPOS_TRANSACCION } from '../config/constants.js';

export const initialState = {
    // El saldo se calcula dinámicamente desde las cuentas
    saldo: 0, // Fallback si no hay cuentas
    metaAhorro: APP_CONFIG.META_AHORRO_DEFAULT,
    
    tarjeta: {
        nombre: "Tarjeta de Débito (Visa)",
        numero: "4532123456784321",
        bloqueada: false
    },

    cuentas: [
        {
            id: 1,
            nombre: "Cuenta Corriente Joven",
            tipo: "Corriente",
            iban: "ES91 2100 0418 4502 0005 1332",
            saldo: 127.80,
            estado: "Activa",
            color: "#42D9FF",
            icono: "fi-rr-wallet"
        },
        {
            id: 2,
            nombre: "Cuenta Ahorro Plus",
            tipo: "Ahorro",
            iban: "ES76 2100 0418 4512 0006 2443",
            saldo: 250.00,
            estado: "Activa",
            color: "#00C853",
            icono: "fi-rr-piggy-bank"
        },
        {
            id: 3,
            nombre: "Hucha Digital",
            tipo: "Ahorro",
            iban: "ES32 2100 0418 4522 0007 3554",
            saldo: 75.50,
            estado: "Activa",
            color: "#FF6B35",
            icono: "fi-rr-money-coin"
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
