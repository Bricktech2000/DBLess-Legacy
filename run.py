from hashlib import sha256, sha1
from functools import reduce
import math
import getpass
import pyperclip

# https://stackoverflow.com/questions/36490354/working-with-bytes-in-python-using-sha-256

# https://stackoverflow.com/questions/44571093/how-can-i-encode-a-32bit-integer-into-a-byte-array/44571179#44571179
# https://stackoverflow.com/questions/51181193/convert-a-8bit-list-to-a-32-bit-integer-array-in-python/51181311
# https://stackoverflow.com/questions/25259947/convert-variable-sized-byte-array-to-a-integer-long
# z85 table:
# https://rfc.zeromq.org/spec/32/
# https://github.com/zeromq/rfc/blob/master/src/spec_32.c
# input: an array of bytes
# output: a string containing the Z85 representation of the input
def encode(bytes):
  out = ''
  table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#'
  value = 0
  for i in range(len(bytes)):
    # make 32-bit integer
    value = value * 256 + bytes[i]
    if i % 4 == 3:
      # convert to printable characters using Z85
      divisor = int(math.pow(85, 4))
      while divisor:
        out += table[value // divisor % 85]
        divisor //= 85
      value = 0
  return out

# https://stackoverflow.com/questions/29408173/byte-operations-xor-in-python
# input: a list of ascii strings to be joined (XORed)
# output: a byte array containing the joined result
def join(*args):
  def xor(bytes1, bytes2):
    return bytes(a ^ b for a, b in zip(bytes1, bytes2))

  return reduce(xor, [sha1(arg.encode('utf-8')).digest() for arg in args])


print('DBLess Password Manager\n')
name = input('Service: ').lower()
user = input('Username: ').lower()
master = getpass.getpass('Master Password: ')
password = encode(sha256(join(name, user, master)).digest())

# https://stackoverflow.com/questions/11063458/python-script-to-copy-text-to-clipboard
try:
  pyperclip.copy(password)
  print('\nPassword has been copied to clipboard.')
except pyperclip.PyperclipException:
  inp = input('\nCould not copy password to clipboard. Would you like to send it to stdout? ')
  if inp.lower()[0] == 'y':
    print(password)
