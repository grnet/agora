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
  
var username, password, firstName, surname, email, group,
  cloudProviderId, inputFile;

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
  {
    name: 'firstname',
    message: 'Enter first name:'
  },
  {
    name: 'surname',
    message: 'Enter surname:'
  },
  {
    name: 'email',
    message: 'Enter e-mail:'
  },
  {
    name: 'group',
    message: 'Enter group:'
  },
  {
    name: 'cloudproviderid',
    message: 'Enter cloud provider ID:'
  }
];

var actualPrompts = [];
  
var knownOpts = {
  'username': [String, null],
  'password': [String, null],
  'firstname': [String, null],
  'surname': [String, null],
  'email': [String, null],
  'group': [String, null],
  'cloudproviderid': [String, null],
  'inputfile': [String, null],
  'help': [Boolean, false]
};

var shortHands = {
  "u": ["--username"],
  "username": ["--username"],
  "p": ["--password"],
  "f": ["--firstname"],
  "s": ["--surname"],
  "e": ["--email"],
  "g": ["--group"],
  "c": ["--cloudproviderid"],
  "i": ["--inputfile"],
  "h": ["--help"]
};

function usage() {
  util.puts("");
  util.print("node create_user.js ",
    "[-u username] ",
    "[-p password] ",
    "[-f first name] ",
    "[-s surname] ",
    "[-e email] ",
    "[-g group] ",
    "[-c cloudproviderid] ",
    "[-i inputfile] ",
    "[-h]");
  util.puts("", "");
  util.print("Create a user with the given attributes. ",
    "The program will prompt for any attribute not passed as an option. ",
    "If an input file is given, its contents will supersede any options.");
  util.puts("", "");
  
  util.puts("Options:");
  util.puts("\t -u username");
  util.puts("\t -p password");
  util.puts("\t -f first name");
  util.puts("\t -s surname");
  util.puts("\t -e email");
  util.puts("\t -g group");
  util.puts("\t -c cloud provider id");
  util.print("\t -i input file: this is a JSON file containing an array of ",
    "user descriptions");
  util.puts("");
  util.puts("\t -h display this help text");
  
}  
  
function saveUser(user, callback) {
  user.save(function (err) {
    if (err) {
      console.log('Error creating user: ' + err);
    } else {
      console.log('Created user: ' + user.username);
    }
    callback();
  });
}
  
var parsed = nopt(knownOpts, shortHands);  

if (parsed.help) {
  usage();
  process.exit(0);
}

if (parsed.inputfile) {
  fs.readFile(parsed.inputfile, 'utf8', function(err, data) {
    if (err) {
      console.log('Error: ' +  err);
      process.exit(1);
    }
    userData = JSON.parse(data);
    userData.forEach(function(userDescription, index, arr) {
      user = new User(userDescription);
      saveUser(user, function() {
        if (index == arr.length - 1) {
          process.exit(0);
        }
      });
    });
  });
} else {
  prompts.forEach(function(prmt) {
    if (!parsed[prmt.name]) {
      actualPrompts.push(prmt);
    }
  });
  
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();

  prompt.get(actualPrompts, function(err, results) {

  id = parsed.id || results.id;
  username = parsed.username || results.username;
  password = parsed.password || results.password;
  firstName = parsed.firstname || results.firstname;
  surname = parsed.surname || results.surname;
  email = parsed.email || results.email;
  group = parsed.group || results.group;
  if (group == '') {
    group = null;
  } 
  
  cloudProviderId = parsed.cloudproviderid || results.cloudproviderid;
  if (cloudProviderId == '') {
    cloudProviderId = null;
  }
  
  user = new User({
    id: id,
    username: username,
    password: password,
    firstName: firstName,
    surname: surname,
    email: email
  });
  if (group) {
    user.group = [ group ];
  }
  if (cloudProviderId) {
    user.cloudProdivedId = cloudProviderId;
  }
  saveUser(user, function() {
    process.exit();
    });
  });
};

