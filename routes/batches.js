const router = require('express').Router()
const { Batch } = require('../models')

router.get('/batches', (req, res, next) => {
  Batch.find()
    .sort({ createdAt: -1 })
    // Send the data in JSON format
    .then((batches) => res.json(batches))
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
  })
  .get('/batches/:id', (req, res, next) => {
    const id = req.params.id
    Batch.findById(id)
      .then((batches) => {
        if (!batches) { return next() }
        res.json(batches)
      })
      .catch((error) => next(error))
  })
  .post('/batches', (req, res, next) => {
    let newBatch = req.body

    Batch.create(newBatch)
      .then((batch) => res.json(batch))
      .catch((error) => next(error))
  })

module.exports = router
