"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeySignatureUploadError = exports.InvalidCryptoStoreError = exports.InvalidStoreError = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

class InvalidStoreError extends Error {
  constructor(reason, value) {
    const message = `Store is invalid because ${reason}, ` + `please stop the client, delete all data and start the client again`;
    super(message);
    this.reason = reason;
    this.value = value;
  }

}

exports.InvalidStoreError = InvalidStoreError;
(0, _defineProperty2.default)(InvalidStoreError, "TOGGLED_LAZY_LOADING", "TOGGLED_LAZY_LOADING");

class InvalidCryptoStoreError extends Error {
  constructor(reason) {
    const message = `Crypto store is invalid because ${reason}, ` + `please stop the client, delete all data and start the client again`;
    super(message);
    this.reason = reason;
    this.name = 'InvalidCryptoStoreError';
  }

}

exports.InvalidCryptoStoreError = InvalidCryptoStoreError;
(0, _defineProperty2.default)(InvalidCryptoStoreError, "TOO_NEW", "TOO_NEW");

class KeySignatureUploadError extends Error {
  constructor(message, value) {
    super(message);
    this.value = value;
  }

}

exports.KeySignatureUploadError = KeySignatureUploadError;