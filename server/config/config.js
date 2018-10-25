

// ====================================
// Puerto
// ====================================
process.env.PORT = process.env.PORT || 3001;

// ====================================
// Entorno
// ====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================================
// Vencimiento del TOKEN
// ====================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = '48h';
// ====================================
// Seed
// ====================================
process.env.SEED = process.env.SEED || 'seed-desarrollo'

// ====================================
// Base de datos
// ====================================

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe'
} else {
    urlDB = process.env.MONGO_URL
}

process.env.URL_DB = urlDB;

// ====================================
// Base de datos
// ====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '217628943884-e9jmtfq29mmo0f6pj8moht177a17losq.apps.googleusercontent.com'
