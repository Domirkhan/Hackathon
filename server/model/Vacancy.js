
import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Название вакансии обязательно'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Описание вакансии обязательно']
  },
  requirements: [{
    type: String,
    required: true
  }],
  profession: {
    type: String,
    required: [true, 'Профессия обязательна'],
    trim: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Индекс для поиска по профессии
vacancySchema.index({ profession: 1 });

export default mongoose.model('Vacancy', vacancySchema);