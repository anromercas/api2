const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var visibilidad = {
	values: ['MUY ALTA', 'ALTA', 'MEDIA', 'BAJA'],
	message: '{VALUE} NO ES UNA VISIBILIDAD PERMITIDA'
};
var estado = {
	values: ['BORRADOR','VALIDACION' ,'EN CREACION', 'PENDIENTE APROBACION', 'TERMINADO'],
	message: '{VALUE} NO ES UNA ESTADO PERMITIDO'
};

var exposicion = {
	values: ['MUY ALTA','ALTA' ,'OCASIONAL', 'IRREGULARMENTE', 'RARA', 'REMOTA'],
	message: '{VALUE} NO ES UNA PROBABILIDAD PERMITIDA'
};

var probabilidad = {
	values: ['TODA PROBABILIDAD','POSIBLEMENTE' ,'ESCASA', 'MUY RARA', 'NUNCA HA OCURRIDO', 'PRACTICAMENTE IMPOSIBLE'],
	message: '{VALUE} NO ES UNA EXPOSICION PERMITIDA'
};

var gravedad = {
	values: ['CATASTROFE','VARIAS MUERTES' ,'MUERTE', 'LESIONES MUY GRAVES', 'LESIONES CON BAJA', 'HERIDAS LEVES'],
	message: '{VALUE} NO ES UNA GRAVEDAD PERMITIDA'
};

var poblacionRiesgo = {
	values: ['TODA LA PLANTA','1.000 A 2.000' ,'300 A 1.000', '100 A 300', '50 A 100', 'MENOS DE 50'],
	message: '{VALUE} NO ES UNA POBLACION EN RIESGO PERMITIDA'
};

var departamentos = {
	values: ['ACERIA', 'LC', 'LF', 'M. MECÁNICO', 'M. ELÉCTRICO', 'SEG-MA', 'TECNICO', 'S. INFO', 'ADMON', 'PERSONAL'],
	message: '{VALUE} NO ES UN DEPARTAMENTO PERMITIDO'
};

const SdrShema = Schema({
	codigo: { type: String, required: false },
	zona: { type: String, required: [true, 'La zona es necesaria'], lowercase: true },
	lider: { type:Schema.ObjectId, ref: 'Usuario', required: [true, 'El lider es necesario'] },
    participantes:[ { type: Schema.Types.ObjectId, required: [true, 'Los participantes son necesarios'], ref: 'Usuario'} ],
	nombre: { type: String, required: [true, 'El nombre es necesario'], lowercase: true },
	descripcion: { type: String, required: [true, 'La descripcion es necesaria'], lowercase: true },
	probabilidad: { type: String, enum: probabilidad, required: [true, 'La probabilidad es necesaria'] },
	exposicion: { type: String, enum: exposicion, required: [true, 'La exposicion es necesaria'] },
	gravedad: { type: String, enum: gravedad, required: [true, 'La gravedad es necesaria'] },
	poblacion_en_riesgo: { type: String, enum: poblacionRiesgo, required: [true, 'La poblacion en riesgo es necesaria'] },
	visibilidad: { type: String, enum: visibilidad, required: false },
	concreto: { type: String, required: [true, 'Es concreto es necesario'] },
	creado_por: { 
		type: Schema.ObjectId, 
		ref: 'Usuario',
		required: [true, 'El campo creado_por es un campo obligatorio ']
	},
	estado: { type: String, enum: estado},
	coste: { type: Number, required: [true, 'El coste es necesario'] },
	img: { type: String, required: false },
	fecha: { type: String, default: Date.now},
	departamento: { type: String, enum: departamentos },
}, { collection: 'sdrs'});

module.exports = mongoose.model('Sdr', SdrShema);