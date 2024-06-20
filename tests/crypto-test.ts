import { Encryption } from "../src/lib/encryption";

const encrypt = new Encryption(`${process.env.AES_KEY}`);

const encryptedText = encrypt.encrypt(Buffer.from("hello world hi"))

const decryptedText = encrypt.decrypt(encryptedText)

console.log(encryptedText)

console.log(decryptedText)