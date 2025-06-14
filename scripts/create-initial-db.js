import fs from 'fs';
import initSqlJs from 'sql.js';

async function createInitialDatabase() {
  try {
    const SQL = await initSqlJs();
    const db = new SQL.Database();

    // Crear la estructura de la base de datos
    db.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0
      )
    `);

    // Insertar datos de ejemplo
    db.run(`
      INSERT INTO todos (title, completed) VALUES 
      ('Aprender React', 0),
      ('Aprender SQLite', 0),
      ('Crear una aplicación', 0)
    `);

    // Exportar la base de datos a un archivo
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync('public/database.sqlite', buffer);

    console.log('Base de datos inicial creada exitosamente');
  } catch (error) {
    console.error('Error al crear la base de datos inicial:', error);
  }
}

createInitialDatabase(); 