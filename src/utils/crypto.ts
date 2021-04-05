import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

interface Decrypt {
  iv: string;
  key: string;
  encrypted: string;
}

interface Data {
  level: number;
  challenges: number;
  experience: number;
}

export function encrypt(data: Data) {
  try {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

    let encrypted = cipher.update(JSON.stringify(data));
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return [iv.toString("hex"), key.toString("hex"), encrypted.toString("hex")];
  } catch (error) {
    throw error;
  }
}

export function decrypt({ iv, key, encrypted }: Decrypt) {
  let newIv = Buffer.from(iv, "hex");
  let newKey = Buffer.from(key, "hex");

  let encryptedData = Buffer.from(encrypted, "hex");

  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(newKey), newIv);

  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
