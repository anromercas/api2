var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Grupo = require('../models/grupo');

// ==========================================
// Obtener todos los Grupos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Grupo.find({})
        .skip(desde)
        .limit(5)
        .populate('lider', 'nombre apellido email')
        .populate('participantes', 'nombre apellido email')
        .exec(
            (err, grupos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando grupo',
                        errors: err
                    });
                }

                Grupo.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        grupos: grupos,
                        total: conteo
                    });
                });

            });
});

// ==========================================
// Obtener un Grupo
// ==========================================
app.get('/:id', (req, res, next) => {
    
    var id = req.params.id;

    Grupo.findById(id)
        .populate('lider', 'nombre apellido email')
        .populate('participantes', 'nombre apellido email')
        .exec(
            (err, grupo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar grupo',
                        errors: err
                    });
                }

                if(!grupo ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El Grupo con el id ' + id + ' no existe',
                        errors: { message: 'No existe el Grupo ' }
                    });
                }

                res.status(200).json({
                    ok: true,
                    grupo: grupo,
                });
            });

});

// ==========================================
// Actualizar Grupo
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Grupo.findById(id, (err, grupo) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Grupo',
                errors: err
            });
        }

        if (!grupo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El grupo con el id ' + id + ' no existe',
                errors: { message: 'No existe un grupo con ese ID' }
            });
        }

            grupo.nombre = body.nombre,
            grupo.lider = body.lider,
            grupo.participantes = body.participantes,
            
        grupo.save((err, grupoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar grupo',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                grupo: grupoGuardado
            });

        });

    });

});


// ==========================================
// Crear un nuevo Grupo
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var grupo = new Grupo({
        nombre: body.nombre,
        lider: body.lider,
        participante1: body.participante1,
        participante2: body.participante2,
        participante3: body.participante3,
        participante4: body.participante4,
        participante5: body.participante5,
        participante6: body.participante6,
        participante7: body.participante7,
        participante8: body.participante8,
        participante9: body.participante9,
        participante10: body.participante10

    });

    grupo.save((err, grupoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el Grupo',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            grupo: grupoGuardado
        });


    });

});


// ============================================
//   Borrar un grupo por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Grupo.findByIdAndRemove(id, (err, grupoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar sdr',
                errors: err
            });
        }

        if (!grupoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un grupo con ese id',
                errors: { message: 'No existe un grupo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            sdr: grupoBorrado
        });

    });

});


module.exports = app;