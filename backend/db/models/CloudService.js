module.exports = function(mongoose) {
  var cloudServiceSchema = new mongoose.Schema({
    _id: Number,
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  });

  var CloudService = mongoose.model('CloudService', cloudServiceSchema);

  return CloudService;
};
