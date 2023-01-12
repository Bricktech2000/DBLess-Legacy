const generatePassword = async (...args) => {
  // z85 spec:
  // https://rfc.zeromq.org/spec/32/
  // https://github.com/zeromq/rfc/blob/master/src/spec_32.c

  const encode = (bytes) => {
    let out = '';
    const table =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#';
    let value = 0;
    for (let i = 0; i < bytes.length; i++) {
      // make 32-bit integer
      value = value * 256 + bytes[i];
      if (i % 4 == 3) {
        // convert to printable characters using Z85
        let divisor = Math.pow(85, 4);
        while (divisor) {
          out += table[Math.floor((value / divisor) % 85)];
          divisor = Math.floor(divisor / 85);
        }
        value = 0;
      }
    }
    return out;
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#examples
  const join = async (...args) => {
    const xor = (a, b) => a.map((x, i) => x ^ b[i]);

    return (
      await Promise.all(
        args
          .map((arg) => new TextEncoder().encode(arg))
          .map((data) => crypto.subtle.digest('SHA-1', data))
      )
    )
      .map((arr) => new Uint8Array(arr))
      .reduce(xor, new Uint8Array(20));
  };

  const digest = Array.from(
    new Uint8Array(await crypto.subtle.digest('SHA-256', await join(...args)))
  );

  const password = encode(digest);

  return password;
};

export default generatePassword;
