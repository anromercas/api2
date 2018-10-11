'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var estado = {
	values: ['BORRADOR','VALIDACION' ,'CREADO', 'APROBADO', 'REALIZADO'],
	message: '{VALUE} NO ES UN ESTADO PERMITIDO'
};

var duracion = {
	values: ['DIAS', 'SEMANAS', 'MESES', 'AÑOS'],
	message: '{VALUE} NO ES UNA DURACION PERMITIDA'
};

var tipo = {
	values: ['CQC', 'INC'],
	message: '{VALUE} NO ES UN TIPO PERMITIDO'
};
var departamentos = {
	values: ['ACERIA', 'LC', 'LF', 'M. MECÁNICO', 'M. ELÉCTRICO', 'SEG-MA', 'TECNICO', 'S. INFO', 'ADMON', 'PERSONAL'],
	message: '{VALUE} NO ES UN DEPARTAMENTO PERMITIDO'
};

const ParcialShema = Schema({
	nombre: { type: String, required: [true, 'El nombre es necesario'] },
	estado: { type: String, enum: estado },
	tipo: { type: String, enum: tipo },
	fecha: { type: Date, required: [true, 'La fecha es necesaria']},
	descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
	grado_correcion: { type: Number, enum: [10, 20, 30, 40], required: [true, 'El grado de correccion es necesario'] },
	coste_estimado: { type: Number, required: [true, 'El coste estimado es necesario'] },
	tiempo_duracion: { type: String, enum: duracion },
	departamento_implicado: { type: String, enum: departamentos },
	responsable: { 
		type:Schema.ObjectId, 
		ref: 'Usuario',
		required: [true, 'El id del usuario responsable es un campo obligatorio '] 
	},
	ventajas: { type: String, required: [true, 'Las ventajas son necesarias'] },
	problemas: { type: String, required: [true, 'Los problemas es necesarios'] },
	fecha_realizacion: { type: Date, default: Date.now, required: [true, 'La fecha de realización es necesaria']},
    comentarios: { type: String, required: false },
    dudas: { type: String, required: false },
    img: { type: String, required: false }
}, { collection: 'soluciones-parciales'});

module.exports = mongoose.model('Partial', ParcialShema);