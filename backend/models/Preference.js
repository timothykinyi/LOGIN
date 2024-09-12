const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
  eID: { type: Number, required: true},
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
