# Equipos para el fulbo

Aplicación web para cargar los nombres de quienes juegan y sortear dos equipos equilibrados al azar. Si el total es impar, un equipo queda con un jugador más.

## Requisitos

- Node.js 20 o 22+
- npm

## Instalación y uso

```bash
npm ci
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación.

## Comandos disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Genera la versión de producción en dist/
npm run preview  # Sirve localmente la versión de producción
```

## Funcionalidades

- Comienza con un campo para el primer jugador y agrega automáticamente otro campo al escribir en el último.
- Descarta los campos vacíos al sortear y requiere al menos dos nombres para armar equipos.
- Permite pegar listas de WhatsApp, limpiando numeración y caracteres invisibles para cargar los nombres automáticamente; el área crece hasta 11 filas y luego se puede ampliar manualmente.
- Mezcla los nombres al azar y los distribuye en dos equipos con tamaños equilibrados.
- Permite copiar los equipos en un formato listo para compartir por WhatsApp, con un enlace a la aplicación.
- Desplaza suavemente la pantalla hasta los nuevos campos y los resultados; respeta la preferencia de movimiento reducido del dispositivo.
- Incluye un footer responsivo, separado del contenido y con fondo propio, con enlaces al proyecto y al perfil del desarrollador.
- Usa `public/icon.png` como icono del sitio.
- Diseño adaptable a pantallas móviles y de escritorio.

## Estructura

```text
public/
  hero.png        Imagen principal de la aplicación
src/
  App.jsx         Interfaz y lógica del sorteo
  index.css       Estilos responsive
  main.jsx        Punto de entrada de React
index.html        Documento HTML de Vite
main.py           Versión de consola en Python
```

La imagen del hero se sirve desde `public/hero.png`.
