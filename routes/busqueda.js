var express = require('express');

var app = express();

var Usuario = require('../models/usuario');
var Sdr = require('../models/situacionRiesgo');
var Parcial = require('../models/solucionParcial');
var Parche = require('../models/solucionParche');
var Ideal = require('../models/solucionIdeal');
var Observaciones = require('../models/observacionesPreventivas');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'sdrs':
            promesa = buscarSdrs(busqueda, regex);
            break;

        case 'ideales':
            promesa = buscarIdeales(busqueda, regex);
            break;

        case 'parciales':
            promesa = buscarParciales(busqueda, regex);
            break;

        case 'parches':
            promesa = buscarParches(busqueda, regex);
            break;

        case 'observaciones':
            promesa = buscarObservaciones(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, sdrs, ideales, parciales, parches y observaciones',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    });

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarSdrs(busqueda, regex),
            buscarIdeales(busqueda, regex),
            buscarParciales(busqueda, regex),
            buscarParches(busqueda, regex),
            buscarUsuarios(busqueda, regex),
            buscarObservaciones(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                sdrs: respuestas[0],
                ideales: respuestas[1],
                parciales: respuestas[2],
                parches: respuestas[3],
                usuarios: respuestas[4],
                observaciones: respuestas[5],
            });
        });


});

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre apellido segundoapellido genero email role img')
            .or([{ 'nombre': regex }, { 'apellido': regex }, { 'segundoapellido': regex }, { 'genero': regex }, { 'email': regex }, { 'img': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });


    });
}

function buscarObservaciones(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Observaciones.find({}, 'formulario repeticion zona usuario fecha')
            .or([{ 'formulario': regex }, { 'repeticion': regex }, { 'zona': regex }])
            .populate('usuario', 'nombre apellido segundoapellido email')
            .exec((err, observaciones) => {

                if (err) {
                    reject('Error al cargar observaciones preventivas', err);
                } else {
                    resolve(observaciones);
                }

            });


    });
}

function buscarSdrs(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Sdr.find({}, 'nombre descripcion estado probabilidad exposicion creado_por img')
            .or([{ 'nombre': regex }, { 'descripcion': regex }, { 'estado': regex }, { 'img': regex }, { 'probabilidad': regex }, { 'exposicion': regex }])
            .populate('creado_por', 'nombre apellido email')
            // .populate('grupo')
            .exec((err, sdrs) => {
                if (err) {
                    reject('Error al cargar SDRs', err);
                } else {
                    resolve(sdrs);
                }
            });
    });
}

function buscarIdeales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Ideal.find({ nombre: regex })
            .populate('responsable', 'nombre apellido email img')
            .exec((err, ideales) => {

                if (err) {
                    reject('Error al cargar soluciones ideales', err);
                } else {
                    resolve(ideales);
                }
            });
    });
}

function buscarParciales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Parcial.find({ nombre: regex })
            .populate('responsable', 'nombre apellido email')
            .exec((err, parciales) => {

                if (err) {
                    reject('Error al cargar soluciones parcial', err);
                } else {
                    resolve(parciales);
                }
            });
    });
}

function buscarParches(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Parche.find({ nombre: regex })
            .populate('responsable', 'nombre apellido email')
            .exec((err, parches) => {

                if (err) {
                    reject('Error al cargar soluciones parche', err);
                } else {
                    resolve(parches);
                }
            });
    });
}





module.exports = app;