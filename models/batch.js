const mongoose = require('../config/database')
const { Schema } = mongoose

const evaluationSchema = new Schema({
  date:  { type: Date, default: Date.now},
  colour: { type: String },
  remark: { type: String },
});

const studentSchema = new Schema({
  batch: { type: String},
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  picture: { type: String },
  evaluation: [evaluationSchema],
});

const batchSchema = new Schema({
  number: {type: Number, required: false },
  startDate: {type: Date },
  endDate: {type: Date},
  students: [studentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAd: { type: Date, default: Date.now },
});

module.exports = mongoose.model('batches', batchSchema )
