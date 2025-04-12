const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://votre-domaine-frontend.com'], // le domaine Vercel ou localhost
  credentials: true // si tu utilises des cookies ou headers d’auth
}));


app.use(express.json());

// Connexion à la base de données SQLite
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('❌ Erreur lors de la connexion à SQLite :', err.message);
  } else {
    console.log('✅ Connecté à la base de données SQLite :', dbPath);
  }
});

// Endpoint pour récupérer les poubelles
app.get('/api/poubelles', (req, res) => {
  const query = 'SELECT * FROM poubelles';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('❌ Erreur SQL :', err.message);
      return res.status(500).json({ error: 'Erreur lors de la récupération des poubelles' });
    }

    res.json(rows);
  });
});

// Suppression de l'authentification
// Suppression de l'endpoint POST /api/login
// Suppression du middleware authenticateToken

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
