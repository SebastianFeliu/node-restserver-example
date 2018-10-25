const express = require('express');
const Categoria = require('../models/categoria');
const _ = require('underscore');

let {verificarToken, verificarAdmin_Role} = require('../middlewares/autenticacion');
const app = express();



// Mostrar categorias
app.get('/categoria',verificarToken, (req, res) => {

Categoria.find({estado:true})
         .sort('nombre')
         .populate('usuario','nombre email')
         .exec((err, categorias) => {
             if (err) {
                 return res.status(500).json({
                     ok: false,
                     err
                 });
             }
             Categoria.count({estado:true},(err, conteo) => {
                 res.json({
                     ok: true,
                     categorias,
                     total: conteo
                 })
             })
         })
});
// Mostrar una categoria con el ID por parametro
app.get('/categoria/:id',verificarToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id,['nombre','estado'])
                .exec((err, categoria) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        categoria
                    })
                })

});

app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let nombreCategoria = {
        nombre: body.nombre
    }

    Categoria.findByIdAndUpdate(id,nombreCategoria,{new: true}, (err, categoriaDB) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id',[verificarToken, verificarAdmin_Role], (req, res) => {
    // borrar solo admin
    // 
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    Categoria.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err,categoriaBorrado) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrado
        })
    })
})

module.exports = app;