const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var repeticion = {
	values: ['DIARIO', 'SEMANAL', 'MENSUAL', 'ANUAL'],
	message: '{VALUE} NO ES UNA REPETICION PERMITIDA'
};

const observacionesShema = Schema({
    formulario: { type: String, required: [true, 'El formulario es necesario'] },
    usuario: { type:Schema.ObjectId, ref: 'Usuario', required: [true, 'El usuario es necesario'] },
    fecha: { type: Date, required: [true, 'La fecha es necesaria']},
    repeticion: { type: String, enum: repeticion},
    zona: { type: String, required: [true, 'La zona es necesaria'] }
}, { collection: 'observacionesPreventivas'});

module.exports = mongoose.model('ObservacionesPreventivas', observacionesShema);