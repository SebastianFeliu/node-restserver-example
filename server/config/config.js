

// ====================================
// Puerto
// ====================================
process.env.PORT = process.env.PORT || 3001;

// ====================================
// Entorno
// ====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================================
// Base de datos
// ====================================

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe'
} else {
    urlDB = 'mongodb://cafeuser:kabastar00@ds037508.mlab.com:37508/cafe2018'
}

process.env.URL_DB = urlDB;

