const express = require('express');
const {verificarToken} = require('../middlewares/autenticacion')
const _ = require('underscore');
let app = express();
let Producto = require('../models/producto');

// Obtener todos los productos
// populate usuario y categoria
// paginado
app.get('/productos', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    desde = Number(desde);
    limite = Number(limite);

    Producto.find({disponible:true})
            .skip(desde)
            .limit(limite)
            .sort('nombre')
            .populate('usuario')
            .populate('categoria')
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                Producto.count({disponible: true}, (err,conteo) => {
                    res.json({
                        ok: true,
                        productos,
                        total: conteo
                    })
                })
            })
})

// Obtener producto por ID
// populate usuario categoria
app.get('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id,['nombre','estado'])
                .populate('categoria')
                .populate('usuario')
                .exec((err, producto) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        producto
                    })
                })

})
// Buscar productos
app.get('/productos/buscar/:termino', verificarToken, (req,res) => {

    let termino = req.params.termino
    let regex = new RegExp(termino,'i')
    Producto.find({nombre: regex})
            .populate('categoria','nombre')
            .exec((err, productos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                })
            })
});

app.post('/productos', verificarToken, (req, res) => {
// Grabar usuario
// Grabar categoria
    let body = req.body;
    let id = req.usuario._id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: id
});
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            producto: productoDB
        })
    })

})

app.put('/productos/:id', verificarToken, (req, res) => {
    // Grabar usuario
    // Grabar categoria
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','precioUni','descripcion','categoria','usuario']);

    Producto.findByIdAndUpdate(id,body,{new: true}, (err, productoDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            producto: productoDB
        });
    })
})

app.delete('/productos/:id', (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err,productoBorrado) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBorrado
        })
    })
    })


module.exports = app;
