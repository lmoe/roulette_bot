export interface IUnlockBlock {
    type: number;
    referenceIndex: number;
    publicKey: Buffer;
    signature: Buffer;
}
