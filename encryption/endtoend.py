"""
def is_even(number):
    return number % 2 == 0

def get_even_letters(message):
    even_letters = []
    for counter in range(0, len(message)):
        if is_even(counter):
            even_letters.append(message[counter])
    return even_letters

def get_odd_letters(message):
    odd_letters = []
    for counter in range(0, len(message)):
        if not is_even(counter):
            odd_letters.append(message[counter])
    return odd_letters

def swap_letters(message):
    letter_list = []
    if not is_even(len(message)):
        message = message + 'x'
    even_letters = get_even_letters(message)
    odd_letters = get_odd_letters(message)
    for counter in range(0, int(len(message)/2)):
        letter_list.append(odd_letters[counter])
        letter_list.append(even_letters[counter])
    new_message = ''.join(letter_list)
    return new_message

text = "Text end to end test"
text = swap_letters(text)

print(text)
print(swap_letters(text))
"""

import string

class Encryption:
    order = []
    countThem = 0
    encryptionLength = 1024

    def __init__(self, key):
        self.key = key
    
    def __str__(self):
        return "To use it you have to pass a key to create an encryption object"

    def get_even_ascii(self, message):
        even_char = []
        for character in range(len(message)):
            if ord(message[character]) % 2 == 0:
                even_char.append(message[character])
                self.order.append(character)
                self.countThem += 1
        return even_char

    def get_odd_ascii(self, message):
        odd_char = []
        for character in range(len(message)):
            if ord(message[character]) % 2 == 1:
                odd_char.append(message[character])
                self.order.append(character)
        return odd_char

    def genDeKey(self):
        dekey = []
        symbols = string.printable
        for counter in range(len(self.key)):
            scounter = counter + ord(self.key[counter]) if counter + ord(self.key[counter]) <= 95 else counter
            if scounter > 95:
                scounter = 0
            dekey.append(chr(ord(self.key[counter]) + ord(symbols[scounter])))
        even_list = self.get_even_ascii(self.key)
        odd_list = self.get_odd_ascii(self.key)
        for character in even_list:
            dekey.append(character)
        for character in odd_list:
            dekey.append(character)
        dekey = "".join(dekey)
        return dekey

    def apply_encryption(self, dekey, message):
        message = list(message)
        iterate = 0
        for counter in range(len(message)):
            message[counter] = chr(ord(message[counter]) + ord(dekey[iterate]))
            iterate = iterate + 1 if iterate < len(dekey)-1 else 0
        for counter in range(ord(dekey[-1])):
            message.insert(int(len(message)-counter), chr(len(message)+ord(message[counter])))
        #while len(message) < self.encryptionLength:
            #for iteration in range(len(message)):
                #message.insert(iteration+1, chr(ord(self.key[]) + ))
        message = "".join(message)
        return message
    
    def revert_encryption(self, dekey, message):
        message = list(message)
        counter = ord(dekey[-1])-1
        for i in range(ord(dekey[-1])):
            del message[int(len(message)-counter)-1]
            counter -= 1
        iterate = 0
        for counter in range(len(message)):
            message[counter] = chr(ord(message[counter]) - ord(dekey[iterate]))
            iterate = iterate + 1 if iterate < len(dekey)-1 else 0
        message = "".join(message)
        return message

import random

def genKey():
    key = []
    for counter in range(128):
        key.append(chr(random.randint(0, 94)))
    key = "".join(key)
    return key

key = genKey()
heremessage = "Hello my name is /place something/"

test = Encryption(key)
test1 = Encryption("dsfjklweruioxcweruiosdfnm,sdf")

mydekey = test.genDeKey()
print("---" + mydekey + "---")
encrypted = test.apply_encryption(mydekey, heremessage)
print(encrypted)
deencrypted = test1.revert_encryption(mydekey, encrypted)
print(deencrypted)

encrypted = test.apply_encryption(mydekey, "i am here")
print(encrypted)
deencrypted = test1.revert_encryption(mydekey, encrypted)
print(deencrypted)