"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SudokuApp = exports.SudokuAppState = exports.SudokuSolver = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.render = render;

var _fableCore = require("fable-core");

var _react = require("react");

var react = _interopRequireWildcard(_react);

var _base = require("todomvc-common/base.js");

var _base2 = _interopRequireDefault(_base);

var _base3 = require("todomvc-common/base.css");

var _base4 = _interopRequireDefault(_base3);

var _index = require("todomvc-app-css/index.css");

var _index2 = _interopRequireDefault(_index);

var _reactDom = require("react-dom");

var react_dom = _interopRequireWildcard(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SudokuSolver = exports.SudokuSolver = function ($exports) {
  var rows = $exports.rows = function rows() {
    return function (x) {
      return x;
    };
  };

  var cols = $exports.cols = function cols(sudoku) {
    return Array.from(_fableCore.Seq.mapIndexed(function (a, row) {
      return Int32Array.from(_fableCore.Seq.mapIndexed(function (b, cell) {
        return sudoku[b][a];
      }, row));
    }, sudoku));
  };

  var getBoxIndex = $exports.getBoxIndex = function getBoxIndex(count, row, col) {
    var n = ~~(row / count);
    var m = ~~(col / count);
    return n * count + m;
  };

  var boxes = $exports.boxes = function boxes(sudoku) {
    var d = Math.floor(Math.sqrt(sudoku.length));
    var list = [];

    for (var a = 0; a <= d * d - 1; a++) {
      list.push([]);
    }

    for (var a = 0; a <= sudoku.length - 1; a++) {
      for (var b = 0; b <= sudoku.length - 1; b++) {
        list[getBoxIndex(d, a, b)].push(sudoku[a][b]);
      }
    }

    return _fableCore.Seq.map(function (source) {
      return Int32Array.from(source);
    }, list);
  };

  var toSudoku = $exports.toSudoku = function toSudoku(x) {
    return Array.from(_fableCore.Seq.map(function (source) {
      return Int32Array.from(source);
    }, x));
  };

  var allUnique = $exports.allUnique = function allUnique(numbers) {
    var set = new Set();
    return _fableCore.Seq.forAll(function (arg00) {
      return _fableCore.Set.addInPlace(arg00, set);
    }, _fableCore.Seq.filter(function () {
      var x = 0;
      return function (y) {
        return x !== y;
      };
    }(), numbers));
  };

  var solvable = $exports.solvable = function solvable(sudoku) {
    return _fableCore.Seq.forAll(function (numbers) {
      return allUnique(numbers);
    }, _fableCore.Seq.append(boxes(sudoku), _fableCore.Seq.append(cols(sudoku), rows()(sudoku))));
  };

  var replaceAtPos = $exports.replaceAtPos = function replaceAtPos(x, row, col, newValue) {
    return Array.from(_fableCore.Seq.delay(function (unitVar) {
      return _fableCore.Seq.map(function (a) {
        return Int32Array.from(_fableCore.Seq.delay(function (unitVar_1) {
          return _fableCore.Seq.map(function (b) {
            return (a === row ? b === col : false) ? newValue : x[a][b];
          }, _fableCore.Seq.range(0, x.length - 1));
        }));
      }, _fableCore.Seq.range(0, x.length - 1));
    }));
  };

  var substitute = $exports.substitute = function substitute(row, col, x) {
    var patternInput = col >= x.length ? [row + 1, 0] : [row, col];
    var b = patternInput[1];
    var a = patternInput[0];

    if (a >= x.length) {
      return _fableCore.Seq.delay(function (unitVar) {
        return _fableCore.Seq.singleton(x);
      });
    } else {
      if (x[a][b] === 0) {
        return _fableCore.Seq.concat(_fableCore.Seq.map(function () {
          var col_1 = b + 1;
          return function (x_1) {
            return substitute(a, col_1, x_1);
          };
        }(), function (source) {
          return _fableCore.Seq.filter(function (sudoku) {
            return solvable(sudoku);
          }, source);
        }(_fableCore.Seq.map(function (newValue) {
          return replaceAtPos(x, a, b, newValue);
        }, _fableCore.Seq.toList(_fableCore.Seq.range(1, x.length))))));
      } else {
        return substitute(a, b + 1, x);
      }
    }
  };

  var getFirstSolution = $exports.getFirstSolution = function ($var1) {
    return _fableCore.Seq.head(substitute(0, 0, $var1));
  };

  return $exports;
}({});

var SudokuAppState = exports.SudokuAppState = function () {
  function SudokuAppState(sudoku) {
    _classCallCheck(this, SudokuAppState);

    this.Sudoku = sudoku;
  }

  _createClass(SudokuAppState, [{
    key: "Equals",
    value: function Equals(other) {
      return _fableCore.Util.equalsRecords(this, other);
    }
  }, {
    key: "CompareTo",
    value: function CompareTo(other) {
      return _fableCore.Util.compareRecords(this, other);
    }
  }]);

  return SudokuAppState;
}();

_fableCore.Util.setInterfaces(SudokuAppState.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Renderer.SudokuAppState");

var SudokuApp = exports.SudokuApp = function (_Component) {
  _inherits(SudokuApp, _Component);

  function SudokuApp(props, ctx) {
    _classCallCheck(this, SudokuApp);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SudokuApp).call(this, props, ctx));

    var _this = {
      contents: null
    };
    var _this_1 = _this2;
    _this2.contents = _this2;
    _this2["init@85"] = 1;
    _this2.contents.state = new SudokuAppState(SudokuSolver.toSudoku(_fableCore.List.ofArray([_fableCore.List.ofArray([0, 0, 8, 3, 0, 0, 6, 0, 0]), _fableCore.List.ofArray([0, 0, 4, 0, 0, 0, 0, 1, 0]), _fableCore.List.ofArray([6, 7, 0, 0, 8, 0, 0, 0, 0]), _fableCore.List.ofArray([0, 1, 6, 4, 3, 0, 0, 0, 0]), _fableCore.List.ofArray([0, 0, 0, 7, 9, 0, 0, 2, 0]), _fableCore.List.ofArray([0, 9, 0, 0, 0, 0, 4, 0, 1]), _fableCore.List.ofArray([0, 0, 0, 9, 1, 0, 0, 0, 5]), _fableCore.List.ofArray([0, 0, 3, 0, 5, 0, 0, 0, 2]), _fableCore.List.ofArray([0, 5, 0, 0, 0, 0, 0, 7, 4])])));
    return _this2;
  }

  _createClass(SudokuApp, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      var inputs = react.createElement.apply(react, ["div", {}].concat(_toConsumableArray(Array.from(_fableCore.Seq.toList(_fableCore.Seq.delay(function (unitVar) {
        return _fableCore.Seq.map(function (i) {
          return react.createElement.apply(react, ["div", {}].concat(_toConsumableArray(Array.from(_fableCore.Seq.toList(_fableCore.Seq.delay(function (unitVar_1) {
            return _fableCore.Seq.map(function (j) {
              return react.createElement.apply(react, ["input", {
                maxLength: 1,
                value: function () {
                  var matchValue = _this3.state.Sudoku[i][j];

                  if (matchValue === 0) {
                    return "";
                  } else {
                    var v = matchValue;
                    return String(v);
                  }
                }(),
                onChange: function (ev) {
                  var sudoku = _this3.state.Sudoku;
                  sudoku[i][j] = Math.floor(ev.target.value);

                  _this3.setState(function () {
                    var inputRecord = _this3.state;
                    return new SudokuAppState(sudoku);
                  }());
                },
                autoFocus: true
              }].concat([]));
            }, _fableCore.Seq.range(0, _this3.state.Sudoku.length - 1));
          }))))));
        }, _fableCore.Seq.range(0, _this3.state.Sudoku.length - 1));
      }))))));
      return react.createElement.apply(react, ["div", {}].concat([react.createElement.apply(react, ["h1", {}].concat(["Sudoku"])), react.createElement.apply(react, ["div", {}].concat([inputs, react.createElement.apply(react, ["br", {}].concat([])), react.createElement.apply(react, ["button", {
        className: "button",
        onClick: function (_arg1) {
          _this3.setState(new SudokuAppState(SudokuSolver.getFirstSolution(_this3.state.Sudoku)));
        }
      }].concat(["Solve"]))]))]));
    }
  }]);

  return SudokuApp;
}(_react.Component);

_fableCore.Util.setInterfaces(SudokuApp.prototype, [], "Renderer.SudokuApp");

_base2.default;
_base4.default;
_index2.default;

function render() {
  react_dom.render(react.createElement.apply(react, [SudokuApp, _fableCore.Util.toPlainJsObj()].concat([])), document.getElementsByClassName("todoapp")[0]);
}

render();