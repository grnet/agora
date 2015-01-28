var logger = require('winston');

function ErrorMessage(message, name, logLevel, err) {
  this.message = message;
  this.name = name;
  this.logLevel = logLevel;
  this.err = err;

  if (logLevel !== undefined) {
    logger.log(logLevel, err);
  }    
};

ErrorMessage.prototype = {
  toString: function() { return this.message + "(" + this.name + ")"; }
};

module.exports = ErrorMessage;
  
