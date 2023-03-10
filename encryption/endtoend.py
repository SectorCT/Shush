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
    encryptionLength = 4096

    def __init__(self, key):
        self.key = key
    
    def __str__(self):
        return "To use it you have to pass a key and a template message to create an encryption object"

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
            if counter > 95:
                counter = 0
            dekey.append(chr(ord(self.key[counter]) + ord(symbols[scounter])))
        dekey = "".join(dekey)
        return dekey

    def apply_encryption(self, dekey, message):
        message = list(message)
        nextKeyEl = 0
        for counter in range(0, len(message)):
            message[counter] = chr(ord(message[counter]) + ord(self.key[nextKeyEl]))
            nextKeyEl = nextKeyEl + 1 if nextKeyEl < len(self.key)-1 else 0
        even_list = self.get_even_ascii(message)
        odd_list = self.get_odd_ascii(message)
        message = []
        for character in even_list:
            message.append(character)
        for character in odd_list:
            message.append(character)
        iterate = 0
        for counter in range(len(message)):
            message[counter] = chr(ord(message[counter]) + ord(dekey[iterate]))
            iterate = iterate + 1 if iterate < len(dekey)-1 else 0
        message = "".join(message)
        return message
    
    def revert_encryption(self, dekey, message):
        temp = list(range(len(message)))
        message = list(message)
        iterate = 0
        for counter in range(len(message)):
            message[counter] = chr(ord(message[counter]) - ord(dekey[iterate]))
            iterate = iterate + 1 if iterate < len(dekey)-1 else 0
        count = 0
        for number in self.order:
            temp[number] = message[count]
            count += 1
        message = temp
        nextKeyEl = 0
        for counter in range(0, len(message)):
            message[counter] = chr(ord(message[counter]) - ord(self.key[nextKeyEl]))
            nextKeyEl = nextKeyEl + 1 if nextKeyEl < len(self.key)-1 else 0
        message = "".join(message)
        return message


key = "ashdfejopsdjfklkd"
message = "Hello my name is /place something/"

test = Encryption(key)
dekey = test.genDeKey()
encrypted = test.apply_encryption(dekey, message)
print(encrypted)
print(test.revert_encryption(dekey, encrypted))