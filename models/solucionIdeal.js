var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estado = {
	values: ['BORRADOR','VALIDACION' ,'CREADO', 'APROBADO', 'REALIZADO'],
	message: '{VALUE} NO ES UNA ESTADO PERMITIDO'
};
var duracion = {
	values: ['DIAS', 'SEMANAS', 'MESES', 'AÑOS', 'SIEMPRE'],
	message: '{VALUE} NO ES UNA DURACION PERMITIDA'
};
var departamentos = {
	values: ['ACERIA', 'LC', 'LF', 'M. MECÁNICO', 'M. ELÉCTRICO', 'SEG-MA', 'TECNICO', 'S. INFO', 'ADMON', 'PERSONAL'],
	message: '{VALUE} NO ES UN DEPARTAMENTO PERMITIDO'
};

const IdealShema = Schema({
	nombre: { type: String, required: [true, 'El nombre es necesario'] },
	estado: { type: String, enum: estado },
	fecha: { type: Date, default: Date.now, required: [true, 'La fecha es necesaria']},
	descripcion: { type: String,  required: [true, 'La descripcion es necesaria'] },
	grado_correccion: { type: Number, default: 100, required: [true, 'El grado de correccion es necesario'] },
	coste_estimado: { type: Number, required: [true, 'El coste estimado es necesario'] },
	tiempo_duracion: { type: String, enum: duracion},
	departamento_implicado: { type: String, enum: departamentos, required: [true, 'El departamento es obligatorio'] },
	responsable: { 
		type:Schema.ObjectId, 
		ref: 'Usuario',
		required: [true, 'El id del usuario responsable es un campo obligatorio '] 
	},
	sdr:{ 
		type:Schema.ObjectId, 
		ref: 'Sdr',
		required: [true, 'El id del sdr es un campo obligatorio '] 
	},
    ventajas: { type: String, required: [true, 'La ventajas son necesarias'] },
	problemas: { type: String, required: [true, 'Los problemas son necesarios'] },
	img: { type: String, required: false }
}, { collection: 'soluciones-ideales'});

module.exports = mongoose.model('Ideal', IdealShema);