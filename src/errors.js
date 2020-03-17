export class InvalidStoreError extends Error {
    static TOGGLED_LAZY_LOADING = "TOGGLED_LAZY_LOADING";
    constructor(reason, value) {
        const message = `Store is invalid because ${reason}, ` +
            `please stop the client, delete all data and start the client again`;
        super(message);
        this.reason = reason;
        this.value = value;
    }
}

export class InvalidCryptoStoreError extends Error {
    static TOO_NEW = "TOO_NEW";
    constructor(reason) {
        const message = `Crypto store is invalid because ${reason}, ` +
            `please stop the client, delete all data and start the client again`;
        super(message);
        this.reason = reason;
        this.name = 'InvalidCryptoStoreError';
    }
}

export class KeySignatureUploadError extends Error {
  constructor(message, value) {
    super(message);
    this.value = value;
  }
}
