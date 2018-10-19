const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var repeticion = {
	values: ['DIARIO', 'SEMANAL', 'MENSUAL', 'ANUAL'],
	message: '{VALUE} NO ES UNA REPETICION PERMITIDA'
};

var estado = {
	values: ['Pendiente Realizar','Pendiente Aprobacion' ,'Aprobada', 'Rechazada'],
	message: '{VALUE} NO ES UNA ESTADO PERMITIDO'
};

const observacionesShema = Schema({
    fechacreacion: { type: Date, default: Date.now },
    formulario: { type: String, required: [true, 'El formulario es necesario'] },
    usuario: { type:Schema.ObjectId, ref: 'Usuario', required: [true, 'El usuario es necesario'] },
    fecha: { type: Date, required: [true, 'La fecha es necesaria']},
    repeticion: { type: String, enum: repeticion},
    estado: { type: String, enum: estado, default: 'Pendiente Realizar'},
    zona: { type: String, required: [true, 'La zona es necesaria'] }
}, { collection: 'observacionesPreventivas'});

module.exports = mongoose.model('ObservacionesPreventivas', observacionesShema);