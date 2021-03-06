"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ExtendableError2 = require("./ExtendableError.js");

var _ExtendableError3 = _interopRequireDefault(_ExtendableError2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorException = function (_ExtendableError) {
	_inherits(ErrorException, _ExtendableError);

	function ErrorException(message) {
		_classCallCheck(this, ErrorException);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ErrorException).call(this, message));

		_this.code = 500;
		_this.name = "ErrorException";
		return _this;
	}

	return ErrorException;
}(_ExtendableError3.default);

exports.default = ErrorException;