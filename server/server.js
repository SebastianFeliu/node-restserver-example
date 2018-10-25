require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
 
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Configuracion global de rutas
app.use(require('./routes/index'))


 // Conexion BD
mongoose.connect(process.env.URL_DB, (err) => {
  if ( err ) throw err;

  console.log('BD Online')
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT)
})