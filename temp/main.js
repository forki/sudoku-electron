"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mainWindow = undefined;
exports.createMainWindow = createMainWindow;

var _electron = require("electron");

var _electron2 = _interopRequireDefault(_electron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainWindow = exports.mainWindow = null;

function createMainWindow() {
  var options = {};
  options.width = 800;
  options.height = 600;
  var window = new _electron2.default.BrowserWindow(options);
  window.loadURL("file://" + __dirname + "/../index.html");
  window.on("closed", function (unitVar0) {
    exports.mainWindow = mainWindow = null;
  });
  exports.mainWindow = mainWindow = window;
}

_electron2.default.app.on("ready", function (arg00_) {
  createMainWindow(arg00_);
});

_electron2.default.app.on("window-all-closed", function (unitVar0) {
  if (process.platform !== "darwin") {
    _electron2.default.app.quit();
  }
});

_electron2.default.app.on("activate", function (unitVar0) {
  if (function () {
    return mainWindow == null;
  }()) {
    createMainWindow();
  }
});