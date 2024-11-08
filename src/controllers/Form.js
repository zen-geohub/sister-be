const Form = require('../models/DataModel')
const mongoose = require('mongoose')

const ping = (req, res) => {
  res.json({ message: "Hello from the server!" })
}

const getData = async (req, res) => {
  try {
    const response = await Form.find()
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const insertData = async (req, res) => {
  const { identity, environmentQuality, security, traffic, neighborhoodConvenience, landEconomicValue } = req.body

  try {
    await Form.create({
      _id: new mongoose.Types.ObjectId(),
      type: "Point",
      properties: {
        identity,
        environmentQuality,
        security,
        traffic,
        neighborhoodConvenience,
        landEconomicValue
      },
      geometry: {
        type: "Point",
        coordinates: [identity.longitude, identity.latitude]
      }
    })

    res.status(201).json({
      message: 'Data berhasil diterima!'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  ping,
  getData,
  insertData
}