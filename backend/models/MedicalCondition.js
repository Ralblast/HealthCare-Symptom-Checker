import mongoose from 'mongoose';

const medicalConditionSchema = new mongoose.Schema({
  condition: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  symptoms: [{
    type: String,
    required: true,
    lowercase: true,
    trim: true
  }],
  description: {
    type: String,
    required: true
  },
  recommendations: [{
    type: String,
    required: true
  }],
  source: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  }
}, {
  timestamps: true
});

medicalConditionSchema.index({ 
  condition: 'text', 
  symptoms: 'text', 
  description: 'text' 
});

const MedicalCondition = mongoose.model('MedicalCondition', medicalConditionSchema);

export default MedicalCondition;
