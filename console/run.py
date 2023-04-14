from hashlib import sha256, sha1
from functools import reduce
import os
import sys
import time
import math
import getpass
import pyperclip

# script path: https://stackoverflow.com/questions/595305/how-do-i-get-the-path-of-the-python-script-i-am-running-in
# https://stackoverflow.com/questions/36490354/working-with-bytes-in-python-using-sha-256

# https://stackoverflow.com/questions/44571093/how-can-i-encode-a-32bit-integer-into-a-byte-array/44571179#44571179
# https://stackoverflow.com/questions/51181193/convert-a-8bit-list-to-a-32-bit-integer-array-in-python/51181311
# https://stackoverflow.com/questions/25259947/convert-variable-sized-byte-array-to-a-integer-long
# z85 spec:
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


def get_token(filename):
  try:
    return open(filename, 'r').read().strip()
  except FileNotFoundError:
    print(f'Error: Token file \'{filename}\' not found.')


print('DBLess\n')
token = get_token(os.path.join(
    os.path.abspath(os.path.dirname(__file__)), '.token'))
if token is None:
  print('Aborting.')
  exit(1)
if token == '':
  print('Warning: Token file is empty.')
name = input('Service: ').lower()
user = input('Username: ').lower()
master = getpass.getpass('Master Password: ')
if master == '':
  print('Warning: Master password field is empty.')
digest = sha256(join(name, user, master, token)).digest()
password = encode(digest)


# https://stackoverflow.com/questions/11063458/python-script-to-copy-text-to-clipboard
try:
  choice = input('[C]opy, [P]rint, [A]bort: ').lower()
  if choice in ['c', '']:
    pyperclip.copy(password)
    print('\nPassword has been copied to clipboard.')
  elif choice == 'p':
    print('\nPassword below will be erased in 10 seconds.')
    print(password, end='')
    sys.stdout.flush()
    time.sleep(10)
    print('\r' + ' ' * len(password))
  elif choice == 'a':
    print('\nAborting.')
    exit(1)
  else:
    print('\nError: Invalid choice.')
    print('Aborting.')
    exit(1)
except pyperclip.PyperclipException:
  print('\nError: Could not copy password to clipboard.')
  print('Aborting.')
  exit(1)
