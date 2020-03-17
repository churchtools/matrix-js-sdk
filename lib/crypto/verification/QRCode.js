"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReciprocateQRCode = exports.SCAN_QR_CODE_METHOD = exports.SHOW_QR_CODE_METHOD = void 0;

var _Base = require("./Base");

var _Error = require("./Error");

/*
Copyright 2018 New Vector Ltd
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * QR code key verification.
 * @module crypto/verification/QRCode
 */
const SHOW_QR_CODE_METHOD = "m.qr_code.show.v1";
exports.SHOW_QR_CODE_METHOD = SHOW_QR_CODE_METHOD;
const SCAN_QR_CODE_METHOD = "m.qr_code.scan.v1";
/**
 * @class crypto/verification/QRCode/ReciprocateQRCode
 * @extends {module:crypto/verification/Base}
 */

exports.SCAN_QR_CODE_METHOD = SCAN_QR_CODE_METHOD;

class ReciprocateQRCode extends _Base.VerificationBase {
  static factory(...args) {
    return new ReciprocateQRCode(...args);
  }

  static get NAME() {
    return "m.reciprocate.v1";
  }

  async _doVerification() {
    if (!this.startEvent) {
      // TODO: Support scanning QR codes
      throw new Error("It is not currently possible to start verification" + "with this method yet.");
    }

    const targetUserId = this.startEvent.getSender();

    if (!this.userId) {
      console.log("Asking to confirm user ID");
      this.userId = await new Promise((resolve, reject) => {
        this.emit("confirm_user_id", {
          userId: targetUserId,
          confirm: resolve,
          // takes a userId
          cancel: () => reject((0, _Error.newUserMismatchError)())
        });
      });
    } else if (targetUserId !== this.userId) {
      throw (0, _Error.newUserMismatchError)({
        expected: this.userId,
        actual: targetUserId
      });
    }

    if (this.startEvent.getContent()['secret'] !== this.request.encodedSharedSecret) {
      throw (0, _Error.newKeyMismatchError)();
    } // If we've gotten this far, verify the user's master cross signing key


    const xsignInfo = this._baseApis.getStoredCrossSigningForUser(this.userId);

    if (!xsignInfo) throw new Error("Missing cross signing info");
    const masterKey = xsignInfo.getId("master");
    const masterKeyId = `ed25519:${masterKey}`;
    const keys = {
      [masterKeyId]: masterKey
    };
    const devices = (await this._baseApis.getStoredDevicesForUser(this.userId)) || [];
    const targetDevice = devices.find(d => {
      return d.deviceId === this.request.targetDevice.deviceId;
    });
    if (!targetDevice) throw new Error("Device not found, somehow");
    keys[`ed25519:${targetDevice.deviceId}`] = targetDevice.getFingerprint();

    if (this.request.requestingUserId === this.request.receivingUserId) {
      delete keys[masterKeyId];
    }

    await this._verifyKeys(this.userId, keys, (keyId, device, keyInfo) => {
      const targetKey = keys[keyId];
      if (!targetKey) throw (0, _Error.newKeyMismatchError)();

      if (keyInfo !== targetKey) {
        console.error("key ID from key info does not match");
        throw (0, _Error.newKeyMismatchError)();
      }

      for (const deviceKeyId in device.keys) {
        if (!deviceKeyId.startsWith("ed25519")) continue;
        const deviceTargetKey = keys[deviceKeyId];
        if (!deviceTargetKey) throw (0, _Error.newKeyMismatchError)();

        if (device.keys[deviceKeyId] !== deviceTargetKey) {
          console.error("master key does not match");
          throw (0, _Error.newKeyMismatchError)();
        }
      } // Otherwise it is probably fine

    });
  }

}

exports.ReciprocateQRCode = ReciprocateQRCode;