import string

class Encryption:
    order = []
    countThem = 0
    encryptionLength = 1024

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
            if scounter > 95:
                scounter = 0
            dekey.append(chr(ord(self.key[counter]) + ord(symbols[scounter])))
        dekey = "".join(dekey)
        return dekey

    def apply_encryption(self, dekey, message):
        message = list(message)
        iterate = 0
        for counter in range(len(message)):
            message[counter] = chr(ord(message[counter]) + ord(dekey[iterate]))
            iterate = iterate + 1 if iterate < len(dekey)-1 else 0
        #while len(message) < self.encryptionLength:
            #for iteration in range(len(message)):
                #message.insert(iteration+1, chr(ord(self.key[]) + ))
        message = "".join(message)
        return message
    
    def revert_encryption(self, dekey, message):
        temp = list(range(len(message)))
        message = list(message)
        iterate = 0
        for counter in range(len(message)):
            message[counter] = chr(ord(message[counter]) - ord(dekey[iterate]))
            iterate = iterate + 1 if iterate < len(dekey)-1 else 0
        message = "".join(message)
        return message


key = "shdjkfhjksdjdiagfohs"
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