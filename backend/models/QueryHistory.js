import mongoose from 'mongoose';

const queryHistorySchema = new mongoose.Schema({
  symptom: {
    type: String,
    required: true,
    trim: true
  },
  clarificationAnswers: [{
    question: String,
    answer: String
  }],
  analysisResult: {
    type: mongoose.Schema.Types.Mixed
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

const QueryHistory = mongoose.model('QueryHistory', queryHistorySchema);

export default QueryHistory;
