const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default option
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) <0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
                //ext: extension
            }
        })
    }

    let archivo = req.files.archivo;

    let nombreSplit = archivo.name.split('.');
    let extension = nombreSplit[nombreSplit.length - 1];

    //Extensiones permitidas
    
    let extensionesValidas = ['png','gif','jpeg','jpg'];

    if (extensionesValidas.indexOf(extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
              message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
              ext: extension
            }
        })
    }
        // Cambiar el nombre del archivo
        let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
      // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

    if (err) {
      return res.status(500).json({
          ok: false,
          err
      });
    }
    // Aqui la imagen se encuentra cargada
    if (tipo==='usuarios') {
        imagenUsuario(id, res ,nombreArchivo);

    } else if (tipo==='productos') {
        imagenProducto(id,res,nombreArchivo);
    }
  });
}); 

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe'
            })
        }

        borrarArchivo(usuarioDB.img,'usuarios');
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            })
        }

        borrarArchivo(productoDB.img,'productos');
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });

    })
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;