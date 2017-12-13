const mongoose = require('../config/database')
const { Schema } = mongoose

const evaluationSchema = new Schema({
  date:  { type: Date, default: Date.now},
  colour: { type: String },
  remark: { type: String },
});

const studentSchema = new Schema({
  batch: { type: String},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  Picture: { type: String },
  Evaluation: [evaluationSchema],
  lastEvaluation: { type: String},
});

const batchSchema = new Schema({
  number: {type: Number, required: true },
  startDate: {type: Date },
  endDate: {type: Date},
  students: [studentSchema],
  evaluationPercentage: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAd: { type: Date, default: Date.now },
});

module.exports = mongoose.model('batches', batchSchema )
