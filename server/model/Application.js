import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  vacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancy',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  coverLetter: {
    type: String
  },
  employerViewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Уникальный индекс для предотвращения повторных откликов
applicationSchema.index({ vacancy: 1, student: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);