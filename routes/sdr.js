var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Sdr = require('../models/situacionRiesgo');

// ==========================================
// Obtener todos los SDRs
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Sdr.find({})
        .skip(desde)
        .limit(5)
        .populate('creado_por', 'nombre apellido email')
        .exec(
            (err, sdrs) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando sdr',
                        errors: err
                    });
                }

                Sdr.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        sdrs: sdrs,
                        total: conteo
                    });
                });

            });
});

// ==========================================
// Obtener un SDR
// ==========================================
app.get('/:id', (req, res, next) => {
    
    var id = req.params.id;

    Sdr.findById(id)
        .populate('creado_por', 'nombre apellido email')
        .exec(
            (err, sdr) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar sdr',
                        errors: err
                    });
                }

                if(!sdr ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El SDR con el id ' + id + ' no existe',
                        errors: { message: 'No existe la SDR ' }
                    });
                }

                res.status(200).json({
                    ok: true,
                    sdr: sdr,
                });
            });

});

// ==========================================
// Actualizar SDR
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Sdr.findById(id, (err, sdr) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar SDR',
                errors: err
            });
        }

        if (!sdr) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El sdr con el id ' + id + ' no existe',
                errors: { message: 'No existe un sdr con ese ID' }
            });
        }

            sdr.codigo = body.codigo,
            sdr.zona = body.zona,
            sdr.grupo = body.grupo,
            sdr.nombre = body.nombre,
            sdr.descripcion = body.descripcion,
            sdr.probabilidad = body.probabilidad,
            sdr.exposicion = body.exposicion,
            sdr.gravedad = body.gravedad,
            sdr.poblacion_en_riesgo = body.poblacion_en_riesgo,
            sdr.visibilidad = body.visibilidad,
            sdr.concreto = body.concreto,
            sdr.creado_por = body.creado_por,
            sdr.estado = body.estado,
            sdr.coste = body.coste,
            sdr.fecha = body.fecha,
            sdr.departamento = body.departamento

        sdr.save((err, sdrGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar sdr',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                sdr: sdrGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo SDR
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var sdr = new Sdr({
        codigo: body.codigo,
        zona: body.zona,
        grupo: body.grupo,
        nombre: body.nombre,
        descripcion: body.descripcion,
        probabilidad: body.probabilidad,
        exposicion: body.exposicion,
        gravedad: body.gravedad,
        poblacion_en_riesgo: body.poblacion_en_riesgo,
        visibilidad: body.visibilidad,
        concreto: body.concreto,
        creado_por: body.creado_por,
        estado: body.estado,
        coste: body.coste,
        img: body.img,
        fecha: body.fecha,
        departamento: body.departamento

    });

    sdr.save((err, sdrGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el SDR',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            sdr: sdrGuardado
        });


    });

});


// ============================================
//   Borrar un sdr por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Sdr.findByIdAndRemove(id, (err, sdrBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar sdr',
                errors: err
            });
        }

        if (!sdrBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un sdr con ese id',
                errors: { message: 'No existe un sdr con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            sdr: sdrBorrado
        });

    });

});


module.exports = app;