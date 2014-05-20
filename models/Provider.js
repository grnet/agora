module.exports = function(mongoose) {
  var ProviderSchema = new mongoose.Schema({  
    name: { type: String, required: true },
    description: { type: String, required: true },
    country: { type: String, required: true }
  });

  var Provider = mongoose.model('Provider', ProviderSchema);

  return Provider;
}
