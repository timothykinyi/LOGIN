const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
  hobbies: [String],
  dietaryPreference: String,
  religiousAffiliation: String,
  selectedHobbies: [String],
  selectedActivities: [String],
  selectedMusicGenres: [String],
  favoriteCuisine: String,
  sleepPreference: String,
  petPreference: String,
  environmentalPractices: String,
}, { timestamps: true });

module.exports = mongoose.model('Preference', PreferenceSchema);
