# Sistema de Registro de Ventas

Sistema de registro de ventas desarrollado con React y Vite, desplegado en GitHub Pages.

## Características

- Registro de ventas con datos de clientes y productos
- Almacenamiento de datos en archivos JSON
- Integración con GitHub Actions para actualización automática
- Interfaz responsiva y moderna

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/front-bd.git
cd front-bd
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con:
```
GITHUB_TOKEN=your_github_token_here
GITHUB_REPOSITORY=your_username/front-bd
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura de Archivos

```
front-bd/
├── .github/
│   └── workflows/
│       └── update-data.yml    # Configuración de GitHub Actions
├── public/
│   └── data/
│       ├── clientes.json     # Datos de clientes
│       └── compras.json      # Datos de compras
├── src/
│   ├── App.jsx              # Componente principal
│   └── App.css              # Estilos
└── vite.config.js           # Configuración de Vite
```

## Uso

1. La aplicación se carga automáticamente desde los archivos JSON en `public/data`
2. Al realizar cambios, se actualizan los archivos JSON mediante GitHub Actions
3. Los cambios se reflejan automáticamente en la página desplegada

## Despliegue

La aplicación está configurada para desplegarse automáticamente en GitHub Pages cuando se hace push a la rama principal.

## Licencia

MIT
