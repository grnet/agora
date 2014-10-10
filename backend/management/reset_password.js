var nopt = require("nopt");
var prompt = require("prompt");
var mongoose = require('mongoose');
var conf = require('../config');
var fs = require('fs');
var util = require('util');
mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db,
  conf.mongo_options);  
var User = require('../db/models/User');

var user;
var usersFile, userData;
  
var  username, password;

var prompts = [
  {
    name: 'username',
    message: 'Enter username:'
  },
  {
    name: 'password',
    hidden: true,
    message: 'Enter password:'
  },
];

var actualPrompts = [];
  
var knownOpts = {
  'username': [String, null],
  'password': [String, null],
  'help': [Boolean, false]
};

var shortHands = {
  "u": ["--username"],
  "username": ["--username"],
  "p": ["--password"],
  "h": ["--help"]
};

function usage() {
  util.puts("");
  util.print("node reset_password.js ",
    "[-u username] ",
    "[-p password] ",
    "[-h]");
  util.puts("", "");
  util.print("Reset a user's password. ",
    "The program will prompt for any attribute not passed as an option. ");
  util.puts("", "");
  
  util.puts("Options:");
  util.puts("\t -u username");
  util.puts("\t -p password");
  util.puts("");
  util.puts("\t -h display this help text");
  
}  
  
function saveUser(user, callback) {
  user.save(function (err) {
    if (err) {
      console.log('Error updating password for user: ' + err);
    } else {
      console.log('Updated password for user: ' + user.username);
    }
    callback();
  });
}
  
var parsed = nopt(knownOpts, shortHands);  

if (parsed.help) {
  usage();
  process.exit(0);
}

prompts.forEach(function(prmt) {
  if (!parsed[prmt.name]) {
  actualPrompts.push(prmt);
  }
});
  
prompt.message = '';
prompt.delimiter = '';
prompt.start();

prompt.get(actualPrompts, function(err, results) {

  if (err) {
    console.log(err);
  } else {
    username = parsed.username || results.username;
    password = parsed.password || results.password;
  
    user = User.findOne({username: username}, function(err, user) {
      if (err) {
        console.log(err);
        process.exit();
      } else {
        user.password = password;
        saveUser(user, function() {
        process.exit();
        });
      };
    });
  }
});
