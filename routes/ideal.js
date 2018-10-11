var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Ideal = require('../models/solucionIdeal');

// ==========================================
// Obtener todos los soluciones ideales
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Ideal.find({})
        .skip(desde)
        .limit(5)
        .populate('responsable', 'nombre apellido email')
        .populate('sdr')
        .exec(
            (err, ideales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando solucion ideal',
                        errors: err
                    });
                }

                Ideal.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        ideales: ideales,
                        total: conteo
                    });
                });

            });
});


// ==========================================
// Actualizar solucion ideal
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Ideal.findById(id, (err, ideal) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar la solucion ideal',
                errors: err
            });
        }

        if (!ideal) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La solucion ideal con el id ' + id + ' no existe',
                errors: { message: 'No existe una solucion ideal con ese ID' }
            });
        }

        ideal.nombre = body.nombre,
        ideal.estado = body.estado,
        ideal.fecha = body.fecha,
        ideal.descripcion = body.descripcion,
        ideal.grado_correccion = body.grado_correccion,
        ideal.coste_estimado = body.coste_estimado,
        ideal.tiempo_duracion = body.tiempo_duracion,
        ideal.departamento_implicado = body.departamento_implicado,
        ideal.responsable = body.responsable,
        ideal.sdr = body.sdr,
        ideal.ventajas = body.ventajas,
        ideal.problemas = body.problemas,
        ideal.img = body.img

        ideal.save((err, idealGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la solucion ideal',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                solucion: idealGuardado
            });

        });

    });

});



// ==========================================
// Crear una nueva solucion ideal
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var ideal = new Ideal({
        nombre: body.nombre,
        estado: body.estado,
        fecha: body.fecha,
        descripcion: body.descripcion,
        grado_correccion: body.grado_correccion,
        coste_estimado: body.coste_estimado,
        tiempo_duracion: body.tiempo_duracion,
        departamento_implicado: body.departamento_implicado,
        responsable: body.responsable,
        ventajas: body.ventajas,
        problemas: body.problemas,
        img: body.img
    });

    ideal.save((err, idealGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la solucion ideal',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            solucion : idealGuardado
        });


    });

});


// ============================================
//   Borrar un solucion ideal por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Ideal.findByIdAndRemove(id, (err, idealBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar solucion ideal',
                errors: err
            });
        }

        if (!idealBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un solucion ideal con ese id',
                errors: { message: 'No existe un solucion ideal con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            solucion: idealBorrado
        });

    });

});


module.exports = app;