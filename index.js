// Arri Amira and Alexa Tally

var tcp = require("../../tcp");
var instance_skel = require("../../instance_skel");
var debug;
var log;

function instance(system) {
  var self = this;

  instance_skel.apply(this, arguments);

  self.actions();

  return self;
}

instance.prototype.updateConfig = function (config) {
  var self = this;

  self.config = config;
  self.init_tcp();
};

instance.prototype.init = function () {
  var self = this;

  debug = self.debug;
  log = self.log;

  self.init_tcp();

  self.create_variables();
  self.init_presets();
  self.update_variables();
};

instance.prototype.init_tcp = function () {
  var self = this;
  var receivebuffer = "";

  if (self.socket !== undefined) {
    self.socket.destroy();
    delete self.socket;
  }

  self.has_data = false;

  if (self.config.host) {
    self.socket = new tcp(self.config.host, self.config.port);

    self.socket.on("status_change", function (status, message) {
      self.status(status, message);
    });

    self.socket.on("error", function (err) {
      debug("Network error", err);
      self.log("error", "Network error: " + err.message);
    });

    self.socket.on("connect", function () {
      debug("Connected");
    });

    // separate buffered stream into lines with responses
    self.socket.on("data", function (chunk) {
      self.log("debug", "data received");
      var i = 0,
        line = "",
        offset = 0;
      receivebuffer += chunk;

      while ((i = receivebuffer.indexOf("\n", offset)) !== -1) {
        line = receivebuffer.substr(offset, i - offset);
        offset = i + 1;
        self.socket.emit("receiveline", line.toString());
      }

      receivebuffer = receivebuffer.substr(offset);
    });

    self.socket.on("receiveline", function (line) {
      debug("Response from device: ", line);
      // self.log('debug', line.toString())
    });
  }
};

instance.prototype.config_fields = function () {
  var self = this;

  return [
    {
      type: "text",
      id: "info",
      width: 12,
      label: "Information",
      value:
        "This module will allow you to control the Tally indicator on an Arri Amira or Alexa camera",
    },
    {
      type: "textinput",
      id: "host",
      label: "Device IP",
      width: 6,
      regex: self.REGEX_IP,
    },
    {
      type: "textinput",
      id: "port",
      label: "Device Port",
      width: 6,
      default: "40000",
      regex: self.REGEX_PORT,
    },
  ];
};

instance.prototype.destroy = function () {
  var self = this;

  if (self.socket !== undefined) {
    self.socket.destroy();
  }
};

instance.prototype.create_variables = function (system) {
  var self = this;
  var variables = [];
  self.setVariableDefinitions(variables);
};

instance.prototype.update_variables = function (system) {
  var self = this;
};

instance.prototype.feedback = function (feedback, bank) {
  var self = this;
};

instance.prototype.init_presets = function () {
  var self = this;
  var presets = [];
  self.setPresetDefinitions(presets);
};

instance.prototype.actions = function () {
  var self = this;

  self.system.emit("instance_actions", self.id, {
    tally: {
      label: "Set Tally",
      options: [
        {
          type: "dropdown",
          label: "Action",
          id: "tallyState",
          default: "0",
          choices: [
            { id: "0", label: "Off" },
            { id: "1", label: "Red" },
            { id: "2", label: "Green" },
          ],
        },
      ],
    },
  });
};

instance.prototype.action = function (action) {
  var self = this;
  var cmd;

  if (action.action === "tally") {
    cmd = "tallyengage " + action.options.tallyState + "\r\n";
  }

  if (cmd !== undefined) {
    if (self.socket !== undefined && self.socket.connected) {
      self.debug("sending: " + cmd);
      self.socket.send(cmd);
    } else {
      self.log("warn", "Socket not connected");
      self.debug("Socket not connected, tried to send: " + cmd);
    }
  }
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
