class Encryption {
    order = [];
    countThem = 0;
    encryptionLength = 1024;
  
    constructor(key) {
      this.key = key;
    }
  
    get_even_ascii(message) {
      const even_char = [];
      for (let character = 0; character < message.length; character++) {
        if (message.charCodeAt(character) % 2 === 0) {
          even_char.push(message[character]);
          this.order.push(character);
          this.countThem += 1;
        }
      }
      return even_char;
    }
  
    get_odd_ascii(message) {
      const odd_char = [];
      for (let character = 0; character < message.length; character++) {
        if (message.charCodeAt(character) % 2 === 1) {
          odd_char.push(message[character]);
          this.order.push(character);
        }
      }
      return odd_char;
    }
  
    genDeKey() {
      const dekey = [];
      const symbols = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
      for (let counter = 0; counter < this.key.length; counter++) {
        let scounter = counter + this.key.charCodeAt(counter);
        if (scounter <= 95) {
          scounter = scounter;
        } else {
          scounter = counter;
        }
        if (counter > 95) {
          counter = 0;
        }
        dekey.push(String.fromCharCode(this.key.charCodeAt(counter) + symbols.charCodeAt(scounter)));
      }
      return dekey.join("");
    }
  
    apply_encryption(dekey, message) {
      message = message.split("");
      let iterate = 0;
      for (let counter = 0; counter < message.length; counter++) {
        message[counter] = String.fromCharCode(message[counter].charCodeAt(0) + dekey.charCodeAt(iterate));
        iterate = iterate < dekey.length - 1 ? iterate + 1 : 0;
      }
      // while (message.length < this.encryptionLength) {
      //   for (let iteration = 0; iteration < message.length; iteration++) {
      //     message.splice(iteration + 1, 0, String.fromCharCode());
      //   }
      // }
      message = message.join("");
      return message;
    }
  
    revert_encryption(dekey, message) {
      const temp = new Array(message.length);
      message = message.split("");
      let iterate = 0;
      for (let counter = 0; counter < message.length; counter++) {
        temp[counter] = String.fromCharCode(message[counter].charCodeAt(0) - dekey.charCodeAt(iterate));
        iterate = iterate < dekey.length - 1 ? iterate + 1 : 0;
      }
      message = temp.join("");
      return message;
    }
  }
  
  const key = "shdjkfhjksdjdiagfohs";
  const heremessage = "Hello my name is /place something/";
  
  const test = new Encryption(key);
  const test1 = new Encryption("dsfjklweruioxcweruiosdfnm,sdf");
  
  const mydekey = test.genDeKey();
  const encrypted = test.apply_encryption(mydekey, heremessage);
  console.log(encrypted);
  const deencrypted = test1.revert_encryption(mydekey, encrypted);
  console.log(deencrypted);
  
  const encrypted2 = test.apply_encryption(mydekey, "i am here");
  console.log(encrypted2);
  const deencrypted2 = test1.revert_encryption(mydekey, encrypted2);
  console.log(deencrypted2);