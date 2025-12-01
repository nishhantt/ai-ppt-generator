const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  
  // User Profile & Learning
  userType: {
    type: String,
    enum: ['student', 'corporate', 'researcher', 'educator', 'entrepreneur', 'unknown'],
    default: 'unknown'
  },
  
  // Preferences learned from conversations
  preferences: {
    presentationStyle: {
      type: String,
      enum: ['professional', 'casual', 'academic', 'creative'],
      default: 'professional'
    },
    averageSlidesPerPresentation: {
      type: Number,
      default: 10
    },
    favoriteTopics: [String],
    commonKeywords: [String],
    colorPreference: {
      type: String,
      default: '#1F4788'
    }
  },
  
  // Analytics
  analytics: {
    totalPresentations: {
      type: Number,
      default: 0
    },
    totalSlides: {
      type: Number,
      default: 0
    },
    mostUsedLayouts: {
      type: Map,
      of: Number,
      default: {}
    },
    lastActiveAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to detect user type based on conversation patterns
UserSchema.methods.detectUserType = function(conversations) {
  const keywords = {
    student: ['assignment', 'homework', 'study', 'exam', 'course', 'class', 'professor', 'semester'],
    corporate: ['business', 'meeting', 'client', 'revenue', 'strategy', 'quarterly', 'stakeholder', 'kpi'],
    researcher: ['research', 'paper', 'study', 'methodology', 'analysis', 'findings', 'hypothesis', 'data'],
    educator: ['teaching', 'lesson', 'students', 'curriculum', 'education', 'learning', 'classroom'],
    entrepreneur: ['startup', 'pitch', 'investor', 'funding', 'product', 'market', 'venture', 'growth']
  };
  
  const scores = {};
  const allText = conversations.map(c => c.messages.map(m => m.content).join(' ')).join(' ').toLowerCase();
  
  Object.keys(keywords).forEach(type => {
    scores[type] = keywords[type].reduce((count, keyword) => {
      return count + (allText.match(new RegExp(keyword, 'g')) || []).length;
    }, 0);
  });
  
  const maxScore = Math.max(...Object.values(scores));
  const detectedType = Object.keys(scores).find(type => scores[type] === maxScore);
  
  if (maxScore > 3) {
    this.userType = detectedType;
  }
  
  return this.userType;
};

// Method to update preferences based on conversation
UserSchema.methods.updatePreferences = function(presentationData) {
  // Update total presentations
  this.analytics.totalPresentations += 1;
  this.analytics.totalSlides += presentationData.slides.length;
  
  // Update average slides
  this.preferences.averageSlidesPerPresentation = 
    Math.round(this.analytics.totalSlides / this.analytics.totalPresentations);
  
  // Update layout usage
  presentationData.slides.forEach(slide => {
    const layout = slide.layout;
    const current = this.analytics.mostUsedLayouts.get(layout) || 0;
    this.analytics.mostUsedLayouts.set(layout, current + 1);
  });
  
  // Update last active
  this.analytics.lastActiveAt = Date.now();
};

module.exports = mongoose.model('User', UserSchema);