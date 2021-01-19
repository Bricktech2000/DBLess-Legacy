from hashlib import sha256
import math
import getpass
import pyperclip

#https://stackoverflow.com/questions/36490354/working-with-bytes-in-python-using-sha-256
#input: an ascii string
#output: a byte array containing the sha256 hash of the input
def hash(ascii):
    return sha256(ascii.encode('utf-8')).digest()

#https://stackoverflow.com/questions/44571093/how-can-i-encode-a-32bit-integer-into-a-byte-array/44571179#44571179
#https://stackoverflow.com/questions/51181193/convert-a-8bit-list-to-a-32-bit-integer-array-in-python/51181311
#https://stackoverflow.com/questions/25259947/convert-variable-sized-byte-array-to-a-integer-long
#z85 table:
#https://rfc.zeromq.org/spec/32/
#https://github.com/zeromq/rfc/blob/master/src/spec_32.c
#input: an array of bytes
#output: a string containing the Z85 representation of the input
def encode(bytes):
    out = ''
    table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#'
    value = 0
    for i in range(len(bytes)):
        #make 32-bit integer
        value = value * 256 + bytes[i]
        if i % 4 == 3:
            #convert to printable characters using Z85
            divisor = int(math.pow(85, 4))
            while divisor:
                out += table[value // divisor % 85]
                divisor //= 85
            value = 0
    return out

def concat(name, user, master):
    return '%'.join((name, user, master))


print('DBLess password manager\n')
name = input('domain name: ').lower()
user = input('username: ').lower()
master = getpass.getpass('master password: ')
password = encode(hash(concat(name, user, master)))
#https://stackoverflow.com/questions/11063458/python-script-to-copy-text-to-clipboard
pyperclip.copy(password)
print('password has been copied to clipboard')
