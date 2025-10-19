FROM nginx:alpine

# Copiar archivos de la aplicación estática
# Página de inicio y recursos raíz
COPY index.html styles.css app.js /usr/share/nginx/html/
# Código fuente y assets
COPY src/ /usr/share/nginx/html/src/
# Páginas adicionales bajo /web (demo principal)
COPY web/ /usr/share/nginx/html/web/

EXPOSE 80

# Comando por defecto de nginx
CMD ["nginx", "-g", "daemon off;"]
