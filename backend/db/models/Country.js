module.exports = function(mongoose) {
  var CountrySchema = new mongoose.Schema({  
    name: { type: String, required: true},
    isoCode: { type: String, required: true },
    modified: { type: Date, default: Date.now }
  });

  var Country = mongoose.model('Country', CountrySchema);

  return Country;
}
