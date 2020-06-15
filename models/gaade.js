const mongoose = require('mongoose')

const gaadeSchema = new mongoose.Schema({
    gaadeTekst: {
        type: String,
        required: true
    },
    gaadeSvar: {
        type: String,
        required: true
    }
}, 
{ timestamps: true})

module.exports = mongoose.model('Gaade', gaadeSchema, 'Gaader')