const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupShema = Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    lider: { type:Schema.ObjectId, ref: 'Usuario', required: [true, 'El lider es necesario'] },
    participantes:[ { type: Schema.Types.ObjectId, required: [true, 'El participante 1 es necesario'], ref: 'Usuario'} ],
}, { collection: 'grupos'});

module.exports = mongoose.model('Grupo', groupShema);