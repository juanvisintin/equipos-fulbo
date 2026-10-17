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

- Valida que la cantidad de jugadores sea un entero positivo.
- Genera un campo de nombre para cada jugador y no permite sortear con nombres vacíos.
- Mezcla los nombres al azar y los distribuye en dos equipos con tamaños equilibrados.
- Muestra un aviso cuando la cantidad de jugadores es impar.
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
