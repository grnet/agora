function ErrorMessage(message, name) {
  this.message = message;
  this.name = name;
};

ErrorMessage.prototype = {
  toString: function() { return this.message + "(" + this.name + ")"; }
};

module.exports = ErrorMessage;
  
