# IBHF25

### Proyecto Sabadell Teens

###### Idea:
> Creación de una APP para menores

Pantallas esenciales de una app de banca
Autenticación y Seguridad

Login/Inicio de sesión: Con opciones de usuario/contraseña, biometría (huella, Face ID)
Registro: Para nuevos usuarios
Recuperación de contraseña
Verificación de identidad: OTP, código SMS, email

Pantallas Principales

Home/Dashboard: Vista general con resumen de cuentas, movimientos recientes, accesos rápidos
Menú principal: Navegación entre secciones

Cuentas y Saldos

Lista de cuentas: Todas las cuentas del usuario
Detalle de cuenta: Saldo, movimientos, información de la cuenta
Movimientos/Historial: Transacciones detalladas con filtros

Transferencias y Pagos

Nueva transferencia: Formulario para enviar dinero
Gestión de beneficiarios: Añadir, editar, eliminar contactos
Confirmación de transferencia: Resumen antes de ejecutar
Comprobante: Recibo de la operación realizada

Tarjetas

Mis tarjetas: Lista de tarjetas de débito/crédito
Detalle de tarjeta: Saldo, límite, movimientos, opciones (bloquear, activar)

Otras Funcionalidades Básicas

Notificaciones: Centro de alertas y mensajes
Perfil/Configuración: Datos personales, preferencias, seguridad
Ayuda/Soporte: FAQ, chat, contacto
Cerrar sesión


---

## Estructura del Proyecto

```
IBHF25/
├── src/                    # Código fuente
│   ├── css/               # Hojas de estilo
│   │   └── styles.css     # Estilos principales
│   ├── js/                # JavaScript
│   │   └── app.js         # Lógica de la aplicación
│   └── assets/            # Recursos (imágenes, iconos, etc.)
├── index.html             # Página principal
├── Dockerfile             # Configuración de contenedor
├── .gitignore             # Archivos ignorados por Git
└── README.md              # Documentación
```

## Despliegue

### Con Docker/Podman:

```bash
# Construir la imagen
docker build -t sabadell-next .

# Ejecutar el contenedor
docker run -d -p 8080:80 --name sabadell-next sabadell-next
```

### Desarrollo local:

Simplemente abre `index.html` en tu navegador, o usa un servidor local:

```bash
# Con Python
python -m http.server 8080

# Con Node.js (npx)
npx serve

# Con PHP
php -S localhost:8080
```

Accede a la aplicación en: `http://localhost:8080`