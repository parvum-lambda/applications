import * as crypto from 'crypto';

type Head<T extends any[]> = T extends [...infer R, any] ? R : any[];
type Last<T extends any[]> = T extends [...any, infer U] ? U : any;

export function promisify<
  Fn extends (...args: any) => any,
  Return = Last<Parameters<Last<Parameters<Fn>>>>,
>(fn: (...args: any) => any, ...args: Head<Parameters<Fn>>): Promise<Return> {
  return new Promise((resolve, reject) => {
    fn.call(this, ...args, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

export function encrypt(input: string | Buffer) {
  const key = Buffer.from(process.env.ENC_KEY, 'base64');
  const algo = process.env.ENC_ALGO;
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algo, key, iv);
  const encrypted: Buffer = Buffer.concat([
    cipher.update(input),
    cipher.final(),
  ]);
  return Buffer.from(
    JSON.stringify({
      iv: iv.toString('base64'),
      data: encrypted.toString('base64'),
    }),
  ).toString('base64url');
}

export function decrypt(input: string) {
  const key = Buffer.from(process.env.ENC_KEY, 'base64');
  const algo = process.env.ENC_ALGO;
  const { iv: ivRaw, data: dataRaw } = JSON.parse(
    Buffer.from(input, 'base64url').toString(),
  );
  const iv = Buffer.from(ivRaw, 'base64');
  const data = Buffer.from(dataRaw, 'base64');

  const decipher = crypto.createDecipheriv(algo, key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

  return decrypted.toString();
}

interface UuidV7 {
  bytes: Uint8Array;
  rnds8Pool: Uint8Array;
  poolPtr: number;
  generate(): UuidV7;
  rng(): Uint8Array;
  fromString(uuid: string): UuidV7;
  toString(): string;
}

interface UuidV7Constructor extends UuidV7 {
  new (bytes?: Uint8Array | string): UuidV7;
  (bytes?: Uint8Array | string): UuidV7;
}

export const UuidV7: UuidV7Constructor = function (
  this: UuidV7 | void,
  uuid: Uint8Array | string,
) {
  if (!(this instanceof UuidV7)) {
    return new UuidV7(uuid);
  }

  UuidV7.rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate
  UuidV7.poolPtr = UuidV7.rnds8Pool.length;

  // UuidV7.fromString = (uuid: string): UuidV7 => {
  //   const uuidBuffer = uuid.toLowerCase().replace(/[^a-z0-9]/g, '');
  //
  //   return UuidV7(Buffer.from(uuidBuffer, 'hex'));
  // };

  UuidV7.generate = (): UuidV7 => {
    const bytes = new Uint8Array(16);

    // random values
    const rand = UuidV7.rng();

    // Get micro time
    const time = process.hrtime.bigint();

    // unix_ts_ms
    // No support for bit operations over 32nd bit, so we need to work with strings =(
    const timeBin = time.toString(2).padStart(47, '0');
    const timeDec32bits = parseInt(timeBin.substring(16, 47), 2);

    bytes[0] = parseInt(timeBin.substring(0, 7), 2);
    bytes[1] = parseInt(timeBin.substring(7, 15), 2);
    bytes[2] = timeDec32bits >>> 24;
    bytes[3] = timeDec32bits >>> 16;
    bytes[4] = timeDec32bits >>> 8;
    bytes[5] = timeDec32bits;

    // ver + rand_a
    const rand_a = rand[0];
    bytes[6] = 0x70 | (rand_a >>> 8);
    bytes[7] = rand_a;

    // var + rand_b
    bytes[8] = 0x80 | (rand[1] >>> 24);

    // fill the remaining bytes
    for (let i = 1; i < 8; i++) {
      bytes[8 + i] = rand[i + 1];
    }

    return UuidV7(bytes);
  };

  UuidV7.rng = () => {
    if (UuidV7.poolPtr > UuidV7.rnds8Pool.length - 10) {
      crypto.randomFillSync(UuidV7.rnds8Pool);
      UuidV7.poolPtr = 0;
    }
    return UuidV7.rnds8Pool.slice(UuidV7.poolPtr, (UuidV7.poolPtr += 10));
  };

  UuidV7.prototype.toString = function (this: UuidV7): string {
    const intervalsIndexes = [
      [0, 8],
      [8, 12],
      [12, 16],
      [16, 20],
      [20, 32],
    ];
    const intervals = [];
    const uuidHex = Buffer.from(this.bytes).toString('hex');

    for (const [start, end] of intervalsIndexes) {
      intervals.push(uuidHex.substring(start, end));
    }

    return intervals.join('-');
  };

  if (typeof uuid === 'string') {
    return UuidV7.fromString(uuid);
  } else if (!(uuid instanceof Uint8Array)) {
    return UuidV7.generate();
  }

  this.bytes = uuid;

  return this;
} as UuidV7Constructor;

export function ucFirst(str: string) {
  return str.substring(0, 1).toUpperCase() + str.substring(1, str.length);
}

export function toCamelCase(str: string) {
  return str
    .toLowerCase()
    .replace(/-|\s/g, '_')
    .split('_')
    .map(ucFirst)
    .join('');
}
