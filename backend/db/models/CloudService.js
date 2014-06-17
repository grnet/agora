module.exports = function(mongoose) {
  var cloudServiceSchema = new mongoose.Schema({  
    name: { type: String, required: true },
    description: { type: String, required: true }
  });

  var CloudService = mongoose.model('CloudService', cloudServiceSchema);

  return CloudService;
};
