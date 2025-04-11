import sqlite3

# Crée une DB SQLite et ajoute 3 poubelles fictives
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS poubelles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    niveau INTEGER DEFAULT 0,
    latitude REAL,
    longitude REAL
)
''')

poubelles = [
    ('Poubelle Paris A', 30, 48.8566, 2.3522),
    ('Poubelle Paris B', 80, 48.8584, 2.2945),
    ('Poubelle Paris C', 100, 48.8606, 2.3376)
]

cursor.executemany('INSERT INTO poubelles (nom, niveau, latitude, longitude) VALUES (?, ?, ?, ?)', poubelles)
conn.commit()
conn.close()