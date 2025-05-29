import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profession: {
    type: String,
    required: true
  },
  salary: {
    from: Number,
    to: Number,
    currency: {
      type: String,
      default: 'RUB'
    }
  },
  workSchedule: String,
  employmentType: String,
  description: String,
  requirements: [String],
  location: String,
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Vacancy', vacancySchema);
