const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator') ;
const Schema = mongoose.Schema;

var rolesValidos = {
	values: ['LIDER_ROLE', 'SUPERVISOR_ROLE', 'DIRECTOR_ROLE', 'ADMIN_ROLE'],
	message: '{VALUE} NO ES UN ROL PERMITIDO'
};

var generos = {
	values: ['HOMBRE', 'MUJER'],
	message: '{VALUE} NO ES UN GENERO PERMITIDO'
};

const UsuarioShema = Schema({
	nombre: { type: String, required: [true, 'El nombre es necesario'] },
	apellido: { type: String, required: [true, 'El primer apellido es necesario'] },
	segundoapellido: { type: String, required: [true, 'El segundo apellido es necesario'] },
	email: { type: String, required: [true, 'El email es necesario'], unique: true, lowercase: true },
	password: { type: String, required: [true, 'El nombre es necesario'] },
	img: { type: String, required: false },
	role: { type: String, enum: rolesValidos, default: 'LIDER_ROLE'},
	genero: { type: String, enum: generos, required: false },
}, {collection: 'usuarios'});

UsuarioShema.plugin(uniqueValidator, { message: ' El {PATH} debe ser único'});

module.exports = mongoose.model('Usuario', UsuarioShema);
