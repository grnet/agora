module.exports = function(mongoose) {
  var CloudServiceProviderSchema = new mongoose.Schema({  
    name: { type: String, required: true },
    description: { type: String, required: true },
    country: { type: String, required: true }
  });

  var CloudServiceProvider =
    mongoose.model('CloudServiceProvider', CloudServiceProviderSchema);

  return CloudServiceProvider;
}
