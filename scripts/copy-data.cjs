const fs = require('fs');
const path = require('path');

// Rutas de origen y destino
const sourceDir = 'F:/registro_ventas_python/ventas_python/bd';
const targetDir = path.join(__dirname, '../public/data');

// Asegurarse de que el directorio de destino existe
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Archivos a copiar
const files = ['clientes.json', 'productos.json', 'compras.json'];

// Copiar cada archivo
files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Archivo ${file} copiado exitosamente`);
  } catch (err) {
    console.error(`Error al copiar ${file}:`, err);
  }
}); 