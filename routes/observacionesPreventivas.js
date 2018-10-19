var express = require('express');

var app = express();

var Observaciones = require('../models/observacionesPreventivas');


// ==========================================
// Obtener todas las observaciones preventivas
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Observaciones.find({})
        .populate('usuario', 'nombre apellido segundoapellido')
        .skip(desde)
        .limit(5)
        .sort({'fecha': 'desc'})
        .exec(
            (err, observaciones) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando observaciones preventivas',
                        errors: err
                    });
                }

                Observaciones.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        observaciones: observaciones,
                        total: conteo
                    });

                });

            });
});

// ==========================================
// Obtener una observacion preventiva
// ==========================================
app.get('/observacion/:id', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var id = req.params.id;
    
    Observaciones.findById(id)
        .populate('usuario', 'nombre apellido segundoapellido')
        .exec(
            (err, observacion) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando observacion preventiva',
                        errors: err
                    });
                }

                if(!observacion ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'La Observacion Preventiva con el id ' + id + ' no existe',
                        errors: { message: 'No existe la Observacion Preventiva ' }
                    });
                }

                res.status(200).json({
                    ok: true,
                    observacion: observacion,
                });


            });
});


// ==========================================
// Obtener todas las observaciones preventivas de un usuario
// ==========================================
app.get('/mis-observaciones/:idusr', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var id = req.params.idusr;
    
    Observaciones.find({usuario: id})
        .populate('usuario', 'nombre apellido segundoapellido')
        .skip(desde)
        .limit(5)
        .sort({'fechacreacion': 'desc'})
        .exec(
            (err, observaciones) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando observaciones preventivas',
                        errors: err
                    });
                }

                Observaciones.count({usuario: id}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        observaciones: observaciones,
                        total: conteo
                    });

                });

            });
});

// ==========================================
// Obtener todas las observaciones preventivas con un estado
// ==========================================
app.get('/estado/:estado', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    estado = req.params.estado;

    Observaciones.find({})
        .or({ 'estado': estado })
        .populate('usuario', 'nombre apellido segundoapellido')
        .skip(desde)
        .limit(5)
        .exec(
            (err, observaciones) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando observaciones preventivas',
                        errors: err
                    });
                }
                var conteo = observaciones.length;
                res.status(200).json({
                    ok: true,
                    observaciones: observaciones,
                    total: conteo
                });

            });
});

// ==========================================
// Crear una nueva observacion preventiva
// ==========================================
app.post('/',  (req, res) => {

    var body = req.body;

    var observacion = new Observaciones ({
        usuario: body.usuario,
        formulario: body.formulario,
        fecha: body.fecha,
        zona: body.zona,
        repeticion: body.repeticion,
        estado: 'Pendiente Realizar'
    });

    observacion.save((err, observacionGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear observacion preventiva',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: observacionGuardado
        });

    });

});

// ==========================================
// Actualizar observacion preventiva
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Observaciones.findById(id, (err, observacion) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar observacion preventiva',
                errors: err
            });
        }

        if (!observacion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La observacion con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        observacion.usuario = body.usuario;
        observacion.formulario = body.formulario;
        observacion.zona = body.zona;
        observacion.fecha = body.fecha;
        observacion.repeticion = body.repeticion;
        observacion.estado = body.estado;

        observacion.save((err, observacionGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar observacion preventiva',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                observacion: observacionGuardado
            });

        });

    });

});

// ============================================
//   Borrar una observacion preventiva por el id
// ============================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Observaciones.findByIdAndRemove(id, (err, observacionBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar Observacion preventiva',
                errors: err
            });
        }

        if (!observacionBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            observacion: observacionBorrado
        });

    });

});

module.exports = app;