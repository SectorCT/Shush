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

key = "abcd"

class Encryption:
    def __init__(self, key, message):
        self.key = key
        self.message = list(message)
    
    def __str__(self):
        return "To use it you have to pass firstly a key and secondly a message"

    def get_even_ascii(self):
        even_char = []
        for character in range(len(self.message)):
            if character % 2 == 0:
                even_char.append(self.message[character])
        return even_char

    def get_odd_ascii(self):
        odd_char = []
        for character in range(len(self.message)):
            if character % 2 == 1:
                odd_char.append(self.message[character])
        return odd_char

    def apply_encryption(self):
        nextKeyEl = 0
        for counter in range(0, len(self.message)):
            self.message[counter] = chr(ord(self.message[counter]) + ord(self.key[nextKeyEl]))
            nextKeyEl = nextKeyEl + 1 if nextKeyEl < 3 else 0
        even_list = self.get_even_ascii()
        odd_list = self.get_odd_ascii()
        self.message = []
        for character in even_list:
            self.message.append(character)
        for character in odd_list:
            self.message.append(character)
        self.message = "".join(self.message)
        return self.message



test = Encryption(key, "Hello")
print(test.apply_encryption())