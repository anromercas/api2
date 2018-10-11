var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

var mdAutenticacion = require('../middlewares/autenticacion');

// ==========================================
// Actualizar usuario
// ==========================================

app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4 horas

    res.status(200).json({
        ok: true,
        token: token
    });
});


// ==========================================
// Autenticación de usuario
// ==========================================

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });

    });


});

function obtenerMenu ( ROLE ) {
    
var menuLider = [
    {
        titulo: 'Menu Lider',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Tablero Principal', url: '/dashboard' },
            { titulo : 'Crear Situación de Riesgo', url: '/sdr/nuevo' },
          ]
    }
];

var menuSupervisor = [
    {
        titulo: 'Menu Supervisor',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Tablero Principal', url: '/dashboard' },
            { titulo : 'Crear Situación de Riesgo', url: '/sdr/nuevo' },
            { titulo : 'Crear Posible Solución', url: '/sdr' },
            { titulo : 'Listar Situaciones de Riesgo', url: '/sdr' },
            { titulo : 'Listar Posibles Soluciones', url: '/sdr' },
          ]
    }
];

var menuDirector = [
    {
        titulo: 'Menu Director',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Tablero Principal', url: '/dashboard' },
            { titulo : 'Crear Situación de Riesgo', url: '/sdr/nuevo' },
            { titulo : 'Crear Posible Solución', url: '/sdr' },
            { titulo : 'Listar Situaciones de Riesgo', url: '/sdr' },
            { titulo : 'Listar Posibles Soluciones', url: '/sdr' },
          ]
    }
];

    var menuAdmin = [
        {
          titulo: 'Menu Admin',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Tablero Principal', url: '/dashboard' },
            { titulo : 'Crear Situación de Riesgo', url: '/sdr/nuevo' },
            { titulo : 'Crear Posible Solución', url: '/sdr' },
            { titulo : 'Listar Situaciones de Riesgo', url: '/sdr' },
            { titulo : 'Listar Posibles Soluciones', url: '/sdr' },
          ]
        },
        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            { titulo: 'Usuarios', url: '/usuarios' },
            { titulo : 'Crear Situación de Riesgo', url: '/sdr/nuevo' },
            { titulo : 'Situaciones de Riesgo', url: '/sdrs' },
            { titulo : 'Soluciones Ideales', url: '/ideales' },
            { titulo : 'Soluciones Parciales', url: '/parciales' },
            { titulo : 'Soluciones Parches', url: '/parches' },
            { titulo : 'Grafica Situaciones de Riesgo', url: '/grafica-sdr' },
          ]
        }
      ];

      if (ROLE === 'ADMIN_ROLE') {
          return menuAdmin;
      }
      if (ROLE === 'LIDER_ROLE') {
        return menuLider;
      }
      if (ROLE === 'SUPERVISOR_ROLE') {
        return menuSupervisor;
      }
      if (ROLE === 'DIRECTOR_ROLE') {
        return menuDirector;
      }
    
}

module.exports = app;