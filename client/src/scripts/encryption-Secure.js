class Encryption {
	constructor(key) {
		this.key = key;
		this.order = [];
		this.countThem = 0;
		this.encryptionLength = 1024;
		this.DeKey = this.genDeKey();
	}
  
	get_even_ascii(message) {
		let evenchar = [];
		for (let character of message) {
			if (character.charCodeAt() % 2 === 0) {
				evenchar.push(character);
				this.order.push(message.indexOf(character));
				this.countThem += 1;
			}
		}
		return evenchar;
	}
  
	get_odd_ascii(message) {
		let oddchar = [];
		for (let character of message) {
			if (character.charCodeAt() % 2 === 1) {
				oddchar.push(character);
				this.order.push(message.indexOf(character));
			}
		}
		return oddchar;
	}
  
	genDeKey() {
		const dekey = [];
		let symbols = [
			"0123456789",
			"abcdefghijklmnopqrstuvwxyz",
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
		].join("");
		for (let counter = 0; counter < this.key.length; counter++) {
			let scounter = counter + this.key.charCodeAt(counter);
			if (scounter > 95) {
				scounter = counter;
			}
			dekey.push(String.fromCharCode(this.key.charCodeAt(counter) + symbols.charCodeAt(scounter)));
		}
		const evenlist = this.get_even_ascii(this.key);
		const oddlist = this.get_odd_ascii(this.key);
		for (let character of evenlist) {
			dekey.push(character);
		}
		for (let character of oddlist) {
			dekey.push(character);
		}
		return dekey.join("");
	}
    
  
	apply_encryption(message) {
		message = message.split("");
		let iterate = 0;
		for (let counter = 0; counter < message.length; counter++) {
			message[counter] = String.fromCharCode(message[counter].charCodeAt() + this.DeKey.charCodeAt(iterate));
			iterate = iterate < this.DeKey.length - 1 ? iterate + 1 : 0;
		}
		for (let counter = 0; counter < this.DeKey.charCodeAt(this.DeKey.length - 1); counter++) {
			message.splice(message.length - counter, 0, String.fromCharCode(message[counter].length + message.length));
		}
		message = message.join("");
		return message;
	}
  
	revert_encryption(dekey, message) {
		message = message.split("");
		let counter = dekey.charCodeAt(dekey.length - 1) - 1;
		for (let i = 0; i < dekey.charCodeAt(dekey.length - 1); i++) {
			message.splice(message.length - counter - 1, 1);
			counter -= 1;
		}
		let iterate = 0;
		for (let counter = 0; counter < message.length; counter++) {
			message[counter] = String.fromCharCode(message[counter].charCodeAt() - dekey.charCodeAt(iterate));
			iterate = iterate < dekey.length - 1 ? iterate + 1 : 0;
		}
		message = message.join("");
		return message;
	}
}

export function genKey() {
	var key = "";
	for (var i = 0; i < 128; i++) {
		key += String.fromCharCode(Math.floor(Math.random() * 95));
	}
	return key;
}
  
/* Here is a quick example of this encryption in use
  const key = genKey();
  const heremessage = "Hello my name is /place something/";
  
  const test = new Encryption(key);
  const test1 = new Encryption("dsfjklweruioxcweruiosdfnm,sdf");
  
  let encrypted = test.apply_encryption(heremessage);
  console.log(encrypted);
  let deencrypted = test1.revert_encryption(test.DeKey, encrypted);
  console.log(deencrypted);

  encrypted = test.apply_encryption("i am here");
  console.log(encrypted);

  deencrypted = test1.revert_encryption(test.DeKey, encrypted);
  console.log(deencrypted);
  */

export default Encryption;