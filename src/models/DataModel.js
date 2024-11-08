const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: String,
  properties: {
    identity: {
      name: String,
      group: String,
      district: String,
      village: String,
      latitude: Number,
      longitude: Number,
      dateSubmitted: Date
    },
    environmentQuality: mongoose.Schema.Types.Mixed,
    security: mongoose.Schema.Types.Mixed,
    traffic: mongoose.Schema.Types.Mixed,
    neighborhoodConvenience: mongoose.Schema.Types.Mixed,
    landEconomicValue: mongoose.Schema.Types.Mixed
  },
  geometry: {
    type: { type: String },
    coordinates: [Number]
  }
}, { collection: "formPoint" })

const Form = mongoose.model('form', formSchema)

module.exports = Form