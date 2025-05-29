import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Название стажировки обязательно'],
    trim: true
  },
  direction: {
    type: String,
    required: [true, 'Направление стажировки обязательно'],
    trim: true
  },
  duration: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['weeks', 'months'],
      required: true
    }
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'Описание стажировки обязательно']
  },
  conditions: [{
    type: String,
    required: true
  }],
  requirements: [{
    type: String,
    required: true
  }],
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Internship', internshipSchema);