from hashlib import sha256, sha1
from buffered_encryption.aesgcm import EncryptionIterator, DecryptionIterator
from functools import reduce
import os
import sys
import time
import math
import shutil
import getpass
import pyperclip

# script path: https://stackoverflow.com/questions/595305/how-do-i-get-the-path-of-the-python-script-i-am-running-in
# shutil zip archives: https://stackoverflow.com/questions/1855095/how-to-create-a-zip-archive-of-a-directory
# shutil make_archive docs: https://docs.python.org/3/library/shutil.html#shutil.make_archive
# tar vs zip: https://stackoverflow.com/questions/10540935/what-is-the-difference-between-tar-and-zip

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


def get_token(filename):
  try:
    return open(filename, 'r').read().strip()
  except FileNotFoundError:
    print(f'Error: Token file \'{filename}\' not found.')


def encrypt(filename, key, nonce):
  print(f'Encrypting...')

  if os.path.exists(filename) and os.path.isdir(filename):
    shutil.make_archive(filename, 'tar', filename)
    with open(f'{filename}.tar', 'rb') as nonencrypted:
      enc = EncryptionIterator(nonencrypted, key, nonce)
      with open(f'{filename}.zdbless', 'wb') as encrypted:
        for chunk in enc:
          encrypted.write(chunk)
    shutil.rmtree(f'{filename}')
    os.remove(f'{filename}.tar')

  elif os.path.exists(filename):
    with open(f'{filename}', 'rb') as nonencrypted:
      enc = EncryptionIterator(nonencrypted, key, nonce)
      with open(f'{filename}.dbless', 'wb') as encrypted:
        for chunk in enc:
          encrypted.write(chunk)
    os.remove(f'{filename}')

  else:
    print('Error: File does not exist.')
    print('Aborting.')
    exit(1)


def decrypt(filename, key, nonce):
  print(f'Decrypting...')
  enc = DecryptionIterator(encrypted, key, nonce)

  # try:

  if os.path.exists(f'{filename}.zdbless'):
    try:
      with open(f'{filename}.zdbless', 'rb') as encrypted:
        dec = DecryptionIterator(encrypted, key, enc.iv, enc.tag)
        with open(f'{filename}.tar', 'wb') as nonencrypted:
          for chunk in dec:
            nonencrypted.write(chunk)
      os.remove(f'{filename}.zdbless')
      shutil.unpack_archive(f'{filename}.tar', filename, 'tar')
      os.remove(f'{filename}.tar')
    except:
      os.remove(f'{filename}.tar')
      raise

  elif os.path.exists(f'{filename}.dbless'):
    try:
      with open(f'{filename}.dbless', 'rb') as encrypted:
        dec = DecryptionIterator(encrypted, key, enc.iv, enc.tag)
        with open(f'{filename}', 'wb') as nonencrypted:
          for chunk in dec:
            nonencrypted.write(chunk)
      os.remove(f'{filename}.dbless')
    except:
      os.remove(f'{filename}')
      raise

  else:
    print('Error: File does not exist.')
    print('Aborting.')
    exit(1)

  # except InvalidToken:
  #   print('Error: Invalid checksum.')
  #   print('Aborting.')
  #   exit(1)


print('DBLess Password Manager\n')
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


print('')
# https://stackoverflow.com/questions/11063458/python-script-to-copy-text-to-clipboard
try:
  choice = input(
      '[C]opy, [P]rint, [A]bort\n[E]ncrypt, [D]ecrypt, [M]odify\nChoice: ').lower()
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
  elif choice in ['e', 'd', 'm']:
    nonce = 0
    filename = input('File name: ')
    print('')
    if choice == 'e':
      encrypt(filename, digest, nonce)
    elif choice == 'd':
      decrypt(filename, digest, nonce)
    elif choice == 'm':
      decrypt(filename, digest, nonce)
      input('Press any key to continue.')
      encrypt(filename, digest, nonce)
    else:
      print('\nError: Invalid choice.')
      print('Aborting.')
      exit(1)
    print('Done.')
  else:
    print('\nError: Invalid choice.')
    print('Aborting.')
    exit(1)
except pyperclip.PyperclipException:
  print('\nError: Could not copy password to clipboard.')
  print('Aborting.')
  exit(1)
