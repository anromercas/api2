'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var estado = {
	values: ['BORRADOR','VALIDACION' ,'CREADO', 'APROBADO', 'REALIZADO'],
	message: '{VALUE} NO ES UN ESTADO PERMITIDO'
};

var duracion = {
	values: ['DIAS', 'SEMANAS', 'MESES', 'AÑOS', 'SIEMPRE'],
	message: '{VALUE} NO ES UNA DURACION PERMITIDA'
};
var departamentos = {
	values: ['ACERIA', 'LC', 'LF', 'M. MECÁNICO', 'M. ELÉCTRICO', 'SEG-MA', 'TECNICO', 'S. INFO', 'ADMON', 'PERSONAL'],
	message: '{VALUE} NO ES UN DEPARTAMENTO PERMITIDO'
};

const ParcheShema = Schema({
	nombre: { type: String, required: [true, 'El nombre es necesario'] },
	estado: { type: String, enum:estado },
	fecha: { type: Date, required: [true, 'La fecha es necesaria']},
	descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
	grado_correcion: { type: Number, required: [true, 'El grado de correccion es necesario'] },
	coste_estimado: { type: Number, required: [true, 'El coste estimado es necesario'] },
	tiempo_duracion: { type: String, enum: duracion},
	departamento_implicado: { type: String, enum: departamentos },
	responsable: { 
		type:Schema.ObjectId, 
		ref: 'Usuario', 
		required: [true, 'El id del usuario responsable es un campo obligatorio '] 
	},
    quien_va_hacer: { type: String, required: [true, 'Quien va a hacer es necesario'] },
    fecha_realizacion: { type: Date, required: [true, 'La fecha es necesaria']},
    comentarios: { type: String, required: false },
	img: { type: String, required: false }
}, { collection: 'soluciones-parche'});

module.exports = mongoose.model('Parche', ParcheShema);