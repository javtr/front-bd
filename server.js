const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Ruta para guardar los archivos JSON
app.post('/api/guardar-datos', async (req, res) => {
  try {
    const { clientes, compras } = req.body;
    
    // Asegurarse de que el directorio existe
    const dataDir = path.join(__dirname, 'public', 'data');
    await fs.mkdir(dataDir, { recursive: true });

    // Guardar los archivos
    await fs.writeFile(
      path.join(dataDir, 'clientes.json'),
      JSON.stringify(clientes, null, 2)
    );
    
    await fs.writeFile(
      path.join(dataDir, 'compras.json'),
      JSON.stringify(compras, null, 2)
    );

    res.json({ success: true, message: 'Archivos actualizados correctamente' });
  } catch (error) {
    console.error('Error al guardar los archivos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar los archivos',
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 