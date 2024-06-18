import crypto from "node:crypto";

export class Encryption {
  private key: string;

  constructor(key: string) {
    this.key = crypto
      .createHash('sha512')
      .update(key)
      .digest('hex')
      .substring(0, 32);
  }

  encrypt(str: any) {
    const cipher = crypto.createCipheriv("aes-256-gcm", this.key, `${process.env.ENCRYPTION_IV}`)
    return Buffer.from(
      cipher.update(str, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64')
  }

  decrypt(str: any) {
    const buff = Buffer.from(str, 'base64')

    const decipher = crypto.createCipheriv("aes-256-gcm", this.key, `${process.env.ENCRYPTION_IV}`)
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    )
  }
}

export const algorithm = new Encryption(`${process.env.AES_KEY}`)